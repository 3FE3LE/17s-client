import { getServerAuth } from '@/lib/server-auth';
import { NextResponse } from 'next/server';
import { getCurrentUserRole } from '@/lib/current-user-role';

export async function GET() {
  const { userId } = await getServerAuth();

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
