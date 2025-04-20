import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 0

export async function GET() {
  const proposals = await prisma.proposal.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      documentUrl: true,
      aiScore: {
        select: {
          classification: true,
          scoreJson: true,
          createdAt: true
        }
      },
      feedback: true
    },
    orderBy: {
      submittedAt: 'desc'
    }
  });

  console.log('Fetched proposals:', JSON.stringify(proposals, null, 2));

  return NextResponse.json({ proposals });
}
