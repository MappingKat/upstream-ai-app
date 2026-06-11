'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserScope } from './auth';

/**
 * Get documents for the current tenant (facility + global).
 */
export async function getDocuments() {
  const scope = await getUserScope();
  if (!scope) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('documents')
    .select('*')
    .or(`tenant_id.eq.${scope.tenantId},scope.eq.global`)
    .order('created_at', { ascending: false });

  return data ?? [];
}

/**
 * Upload a document to Supabase Storage and create DB record.
 */
export async function uploadDocument(input: {
  title: string;
  docType: string;
  file: {
    name: string;
    type: string;
    size: number;
    base64: string;
  };
}) {
  const scope = await getUserScope();
  if (!scope) return { error: 'Not authenticated' };

  const supabase = await createClient();

  // Upload file to storage
  const ext = input.file.name.split('.').pop()?.toLowerCase() ?? 'pdf';
  const storagePath = `${scope.tenantId}/${Date.now()}_${input.file.name}`;

  const buffer = Buffer.from(input.file.base64, 'base64');
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(storagePath, buffer, {
      contentType: input.file.type,
    });

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  // Create document record
  const { data: doc, error: dbError } = await supabase
    .from('documents')
    .insert({
      tenant_id: scope.tenantId,
      title: input.title,
      doc_type: input.docType,
      scope: 'facility',
      storage_path: storagePath,
      file_type: ext,
      file_size: input.file.size,
      processing_status: 'processing',
      uploaded_by: scope.userId,
    })
    .select()
    .single();

  if (dbError) return { error: dbError.message };

  // Trigger extraction (fire and forget)
  fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? '' : ''}/api/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId: doc.id }),
  }).catch(() => {
    // Extraction runs in background — failure is non-blocking
  });

  return { data: doc };
}

/**
 * Get a signed URL for viewing/downloading a document.
 */
export async function getDocumentUrl(storagePath: string, scope: string = 'facility') {
  const supabase = await createClient();
  const bucket = scope === 'global' ? 'global-library' : 'documents';

  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, 3600); // 1 hour

  return data?.signedUrl ?? null;
}

/**
 * Search documents using full-text search.
 */
export async function searchDocuments(query: string) {
  const scope = await getUserScope();
  if (!scope) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('documents')
    .select('*')
    .or(`tenant_id.eq.${scope.tenantId},scope.eq.global`)
    .textSearch('fts_content', query)
    .limit(20);

  return data ?? [];
}
