import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { deleteMessage, listMessages, setMessageRead } from '@/lib/admin-data';

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const unreadOnly = new URL(request.url).searchParams.get('unread') === '1';
  return NextResponse.json({ messages: await listMessages({ unreadOnly }) });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const id = typeof body.id === 'number' ? body.id : NaN;
  const read = body.read === true;
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });

  if (!(await setMessageRead(id, read))) {
    return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });

  if (!(await deleteMessage(id))) {
    return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
