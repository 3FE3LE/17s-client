import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getCurrentUserRole } from '@/lib/current-user-role';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await getCurrentUserRole();

  return NextResponse.json({
    userId,
    role: result.role,
    source: result.source,
  });
}
