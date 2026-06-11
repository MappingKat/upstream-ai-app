import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";
import { voyageEmbed } from "@/lib/voyage";
import mammoth from "mammoth";

const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 150;
const INSERT_BATCH_SIZE = 200;
const EMBED_BATCH_SIZE = 128;

export const maxDuration = 300;

interface Chunk {
  content: string;
  index: number;
  page_number: number;
}

function chunkText(text: string, chunkSize: number, pageNumber: number): Chunk[] {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: Chunk[] = [];
  let current = "";
  let index = 0;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (current.length + trimmed.length + 1 > chunkSize && current.length > 0) {
      chunks.push({ content: current.trim(), index, page_number: pageNumber });
      index++;
      const overlap = current.trim().slice(-CHUNK_OVERLAP);
      current = overlap + "\n\n" + trimmed;
    } else {
      current += (current ? "\n\n" : "") + trimmed;
    }
  }

  if (current.trim()) {
    chunks.push({ content: current.trim(), index, page_number: pageNumber });
  }

  return chunks;
}

async function extractPdfPages(buffer: Buffer): Promise<{ text: string; pageNumber: number }[]> {
  // Dynamic import — pdf-parse has ESM issues with Turbopack
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfParseModule = await import("pdf-parse") as any;
  const pdfParse = pdfParseModule.default ?? pdfParseModule;
  const result = await pdfParse(buffer);
  const pages: { text: string; pageNumber: number }[] = [];

  if (result.numpages <= 1) {
    pages.push({ text: result.text, pageNumber: 1 });
  } else {
    const pageTexts = result.text.split(/\f/);
    for (let i = 0; i < pageTexts.length; i++) {
      const text = pageTexts[i].trim();
      if (text) pages.push({ text, pageNumber: i + 1 });
    }
    if (pages.length === 0) pages.push({ text: result.text, pageNumber: 1 });
  }

  return pages;
}

async function embedChunks(contents: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (let i = 0; i < contents.length; i += EMBED_BATCH_SIZE) {
    const batch = contents.slice(i, i + EMBED_BATCH_SIZE);
    const batchEmbeddings = await voyageEmbed(batch);
    embeddings.push(...batchEmbeddings);
  }
  return embeddings;
}

export async function POST(request: NextRequest) {
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { documentId } = await request.json();

  if (!documentId) {
    return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("id, storage_path, scope")
    .eq("id", documentId)
    .single();

  if (docError || !doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const storageBucket = doc.scope === "global"
    ? (process.env.SUPABASE_GLOBAL_LIBRARY_BUCKET ?? "global-library")
    : "documents";

  try {
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(storageBucket)
      .download(doc.storage_path);

    if (downloadError || !fileData) {
      await supabase.from("documents").update({ processing_status: "failed" }).eq("id", documentId);
      return NextResponse.json({ error: `Download failed: ${downloadError?.message}` }, { status: 500 });
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const ext = doc.storage_path.toLowerCase().slice(doc.storage_path.lastIndexOf("."));

    let chunks: Chunk[] = [];
    let fullText = "";

    if (ext === ".pdf") {
      const pages = await extractPdfPages(buffer);
      fullText = pages.map((p) => p.text).join("\n\n");
      let globalIndex = 0;
      for (const page of pages) {
        const pageChunks = chunkText(page.text, CHUNK_SIZE, page.pageNumber);
        for (const chunk of pageChunks) {
          chunks.push({ ...chunk, index: globalIndex });
          globalIndex++;
        }
      }
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ buffer });
      fullText = result.value;
      chunks = chunkText(fullText, CHUNK_SIZE, 1);
      chunks = chunks.map((c, i) => ({ ...c, index: i, page_number: i + 1 }));
    } else {
      await supabase.from("documents").update({ processing_status: "failed" }).eq("id", documentId);
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (!fullText.trim()) {
      await supabase.from("documents").update({ processing_status: "ready" }).eq("id", documentId);
      return NextResponse.json({ chunks: 0 });
    }

    const embeddings = await embedChunks(chunks.map((c) => c.content));

    await supabase.from("document_chunks").delete().eq("document_id", documentId);

    for (let i = 0; i < chunks.length; i += INSERT_BATCH_SIZE) {
      const batch = chunks.slice(i, i + INSERT_BATCH_SIZE);
      const { error } = await supabase.from("document_chunks").insert(
        batch.map((chunk, batchOffset) => ({
          document_id: documentId,
          chunk_index: chunk.index,
          content: chunk.content,
          page_number: chunk.page_number,
          embedding: embeddings[i + batchOffset],
        }))
      );
      if (error) throw new Error(`Chunk insert failed: ${error.message}`);
    }

    await supabase.from("documents").update({ processing_status: "ready" }).eq("id", documentId);

    return NextResponse.json({ chunks: chunks.length });
  } catch (err) {
    await supabase.from("documents").update({ processing_status: "failed" }).eq("id", documentId);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Extraction failed" },
      { status: 500 }
    );
  }
}
