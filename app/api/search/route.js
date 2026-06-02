import { NextResponse } from "next/server";
import { enrichMatches } from "@/lib/data";
import { semanticPaperSearch } from "@/lib/vectorSearch";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const topK = Math.min(Math.max(Number(searchParams.get("k")) || 10, 1), 25);

    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter 'q'" },
        { status: 400 },
      );
    }

    const matches = await semanticPaperSearch(query, topK);

    return NextResponse.json({
      query,
      count: matches.length,
      results: enrichMatches(matches),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Semantic search failed" },
      { status: 500 },
    );
  }
}
