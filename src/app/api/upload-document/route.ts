import { NextRequest, NextResponse } from 'next/server';
import { uploadDocument } from '@/lib/actions/documents';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await uploadDocument(body);

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ data: result.data });
}
