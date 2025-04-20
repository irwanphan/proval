import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const proposals = await prisma.proposal.findMany({
    include: {
      aiScore: true
    },
    orderBy: {
      submittedAt: 'desc'
    }
  });

  return NextResponse.json({ proposals });
}
