import { NextResponse } from "next/server";
import { getPaper } from "@/lib/data";

export async function GET(_request, { params }) {
  const { id } = await params;
  const paper = getPaper(id);

  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  return NextResponse.json(paper);
}
