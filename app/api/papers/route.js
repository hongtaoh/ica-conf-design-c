import { NextResponse } from "next/server";
import { filterPapers, getPaginated } from "@/lib/data";

export function GET(request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const filtered = filterPapers(params);
  const payload = getPaginated(filtered, params);

  return NextResponse.json(payload);
}
