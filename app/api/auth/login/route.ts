import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password || ''))) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  const token = user.id; // untuk PoC, cukup gunakan ID

  // Simpan token sementara (di cookie / localStorage di FE)
  return NextResponse.json({ message: 'Login successful', token, user: { email: user.email, name: user.name } });
}
