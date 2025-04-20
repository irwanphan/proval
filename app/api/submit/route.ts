import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { evaluateProposal } from '@/lib/evaluateWithAI';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const title = formData.get('title') as string;
    const problem = formData.get('problem') as string;
    const solution = formData.get('solution') as string;
    const file = formData.get('file') as File | null;

    // Handle file upload jika ada
    let documentUrl = '';
    if (file && file.name) {
      const blob = await put(file.name, file, {
        access: 'public',
      });
      documentUrl = blob.url;
    }

    // Simpan ke DB
    const proposal = await prisma.proposal.create({
      data: {
        user: {
          connectOrCreate: {
            where: { email },
            create: { email, name, password: '' },
          },
        },
        title,
        problem,
        solution,
        documentUrl,
        status: 'SUBMITTED'
      },
    });

    const aiResult = await evaluateProposal({ title, problem, solution });

    await prisma.aiEvaluation.create({
      data: {
        proposalId: proposal.id,
        scoreJson: aiResult.scores,
        classification: aiResult.classification,
        flagged: false
      }
    });

    return NextResponse.json({ message: 'Proposal submitted successfully', id: proposal.id });
  } catch (error) {
    console.error('Error submitting proposal:', error);
    return NextResponse.json(
      { message: 'Failed to submit proposal', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
