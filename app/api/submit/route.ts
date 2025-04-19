import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const title = formData.get('title') as string;
  const problem = formData.get('problem') as string;
  const solution = formData.get('solution') as string;
  const file = formData.get('file') as File;

  if (!file || !file.name) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}_${file.name}`;
  const filepath = path.join(process.cwd(), 'public/uploads', filename);
  await writeFile(filepath, buffer);

  // Simpan ke DB
  const proposal = await prisma.proposal.create({
    data: {
      user: {
        connectOrCreate: {
          where: { email },
          create: { email, name },
        },
      },
      title,
      problem,
      solution,
      documentUrl: `/uploads/${filename}`,
      status: 'SUBMITTED'
    },
  });

  return NextResponse.json({ message: 'Proposal submitted successfully', id: proposal.id });
}
