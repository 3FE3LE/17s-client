import { loadEnv } from '@17suit/core';
import { getServerAuth } from '@/lib/server-auth';
import { NextResponse } from 'next/server';

/** Read-only proxy: which third-party integrations are real vs. dummy. */
export async function GET() {
  const { userId, getToken } = await getServerAuth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tokenTemplate = process.env.CLERK_JWT_TEMPLATE;
  const token = tokenTemplate ? await getToken({ template: tokenTemplate }) : await getToken();
  if (!token) {
    return NextResponse.json({ error: 'Missing Clerk token' }, { status: 401 });
  }

  const apiBaseUrl = loadEnv()
    .API_BASE_URL.replace(/\/+$/, '')
    .replace(/\/api$/, '');
  const response = await fetch(`${apiBaseUrl}/api/integrations`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('content-type') ?? 'application/json' },
  });
}
