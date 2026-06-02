import { NextResponse } from "next/server";
import { filterAuthors, getPaginated } from "@/lib/data";

export function GET(request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const filtered = filterAuthors(params);
  const payload = getPaginated(filtered, params);

  return NextResponse.json(payload);
}
