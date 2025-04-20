import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { evaluateProposal } from '@/lib/evaluateWithAI';
import { Prisma } from '@prisma/client';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
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
        const timestamp = Date.now();
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const blobName = `proposals/${timestamp}-${safeFileName}`;
        
        console.log('Uploading file:', {
          originalName: file.name,
          safeFileName,
          blobName,
          size: file.size
        });

        const blob = await put(blobName, file, {
          access: 'public',
        });
        documentUrl = blob.url;

        console.log('File uploaded successfully:', {
          url: documentUrl,
          blob
        });
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
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2024 adalah kode untuk connection pool timeout
        if (error.code === 'P2024' && retries < MAX_RETRIES - 1) {
          retries++;
          await wait(RETRY_DELAY * retries); // Exponential backoff
          continue;
        }
      }
      
      return NextResponse.json(
        { 
          message: 'Failed to submit proposal', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { message: 'Failed to submit proposal after maximum retries' },
    { status: 500 }
  );
}
