import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { voyageEmbed } from "@/lib/voyage";
import { getPostHogClient } from "@/lib/posthog-server";

const anthropic = new Anthropic();

const MODE_A = `You are Upstream AI's document assistant for water and wastewater utility operators.
Answer the question using ONLY the provided document excerpts below.
For every factual claim, cite the source document title and page number in brackets, e.g. [Pump O&M Manual, p.47].
If the excerpts do not fully answer the question, say so explicitly — do not supplement with outside knowledge.
Never speculate about this facility's permit limits, equipment specifications, or operational parameters unless they appear in the excerpts.
Be concise and practical. Operators need actionable answers, not textbook summaries.`;

const MODE_B = `You are Upstream AI's document assistant for water and wastewater utility operators.
No relevant documents were found in this facility's library for this question.

You may answer using your general water and wastewater engineering knowledge under these strict rules:

1. Begin your response with exactly this label on its own line:
   "⚠️ General knowledge — not based on your facility's documents."

2. Stay strictly within water and wastewater operations: treatment processes, equipment troubleshooting, process control, and standard O&M practices.

3. Do NOT answer questions about:
   - This facility's specific permit limits or effluent requirements
   - DMR or MOR calculations for this facility
   - Electrical systems, structural engineering, or chemical safety beyond standard WW O&M
   - Anything requiring a licensed engineer's judgment
   If asked about these, respond: "This question requires your facility-specific documents or a licensed engineer. I cannot answer it reliably without that context."

4. End every response with exactly this line:
   "📋 Upload your O&M manual or permit documents to get answers specific to your facility."

Be concise and practical. Operators need actionable answers, not textbook summaries.`;

export async function POST(request: NextRequest) {
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { query, facilityId } = await request.json();

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (!profile?.tenant_id) {
    return NextResponse.json({ error: "User has no associated utility" }, { status: 403 });
  }

  try {
    const [queryEmbedding] = await voyageEmbed([query]);

    const { data: chunks, error: searchError } = await supabase.rpc(
      "search_document_chunks",
      {
        query_embedding: queryEmbedding,
        keyword_query: query,
        p_tenant_id: profile.tenant_id,
        p_facility_id: facilityId ?? null,
        p_limit: 8,
      }
    );

    if (searchError) {
      return NextResponse.json({ error: `Search failed: ${searchError.message}` }, { status: 500 });
    }

    const results = (chunks ?? []) as {
      content: string;
      document_title: string;
      page_number: number;
      similarity: number;
    }[];

    const confident = results.filter((r) => r.similarity >= 0.75);
    const isModA = confident.length > 0;
    const systemPrompt = isModA ? MODE_A : MODE_B;

    let userMessage: string;
    if (isModA) {
      const excerpts = confident
        .map((c) => `[${c.document_title}, p.${c.page_number}]:\n${c.content}`)
        .join("\n\n---\n\n");
      userMessage = `${excerpts}\n\n---\n\nOperator question: ${query}`;
    } else {
      userMessage = query;
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const answer = response.content[0].type === "text" ? response.content[0].text : "";

    const sources = isModA
      ? confident.map((c) => ({ title: c.document_title, page: c.page_number }))
      : [];

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id,
      event: "library_chat_response_sent",
      properties: {
        mode: isModA ? "A" : "B",
        chunks_used: confident.length,
        query_length: query.length,
        facility_id: facilityId ?? null,
      },
    });

    return NextResponse.json({
      answer,
      mode: isModA ? "A" : "B",
      chunks_used: confident.length,
      sources,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Chat failed" },
      { status: 500 }
    );
  }
}
