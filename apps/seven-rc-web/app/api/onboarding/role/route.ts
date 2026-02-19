import { auth, clerkClient } from '@clerk/nextjs/server';
import type { SevenReservationsClubSetRolePayload } from '@17suit/module-seven-reservations-club';
import { NextResponse } from 'next/server';
import { isAppRole } from '@/lib/role';
import { persistOnboardingRole } from '@/lib/platform-api';

interface SetRoleBody {
  role?: unknown;
}

export async function POST(request: Request) {
  const { userId, getToken } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as SetRoleBody;

  if (!isAppRole(body.role)) {
    return NextResponse.json({ error: 'Invalid role value' }, { status: 400 });
  }

  const role: SevenReservationsClubSetRolePayload['role'] = body.role;
  const tokenTemplate = process.env.CLERK_JWT_TEMPLATE;
  if (!tokenTemplate) {
    return NextResponse.json(
      { error: 'Missing CLERK_JWT_TEMPLATE configuration' },
      { status: 500 },
    );
  }
  const token = await getToken({ template: tokenTemplate });

  if (!token) {
    return NextResponse.json({ error: 'Missing Clerk template token' }, { status: 401 });
  }

  try {
    await persistOnboardingRole(token, role);

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });

    return NextResponse.json({ ok: true, role });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error while setting role';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
