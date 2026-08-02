import { cookies } from 'next/headers';

import env from '@/config/env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  const type = new URL(request.url).searchParams.get('type');

  if (!type) {
    return new Response('Missing export type', { status: 400 });
  }

  const token = (await cookies()).get(env.API_TOKEN_STORED_KEY)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const upstreamUrl = new URL(
    `/projects/${projectId}/board/export`,
    env.API_BASE_URL,
  );
  upstreamUrl.searchParams.set('type', type);

  const upstream = await fetch(upstreamUrl, {
    method: 'GET',
    headers: {
      Accept: 'text/event-stream',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
    signal: request.signal,
  });

  if (!upstream.ok || !upstream.body) {
    return new Response(upstream.statusText || 'Export failed', {
      status: upstream.status || 502,
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
