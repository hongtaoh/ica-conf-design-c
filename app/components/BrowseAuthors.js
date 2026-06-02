"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import { loadAuthors } from "./clientData";

const pageSize = 30;

export default function BrowseAuthors() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState(() => searchParams.get("q") || "");
  const [year, setYear] = useState(() => searchParams.get("year") || "");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    loadAuthors()
      .then((data) => {
        if (active) setAuthors(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          authors.flatMap((a) => a.years_attended || []).filter(Boolean),
        ),
      ).sort((a, b) => b - a),
    [authors],
  );

  const searchableAuthors = useMemo(
    () =>
      authors.map((a) => ({
        ...a,
        searchText: [a.author_name, ...(a.affiliations || [])]
          .join(" ")
          .toLowerCase(),
      })),
    [authors],
  );

  const filtered = useMemo(() => {
    const cleanTerm = term.trim().toLowerCase();
    return searchableAuthors.filter(
      (a) =>
        (!year || (a.years_attended || []).includes(Number(year))) &&
        (!cleanTerm || a.searchText.includes(cleanTerm)),
    );
  }, [searchableAuthors, term, year]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function pushParams(newTerm, newYear) {
    const params = new URLSearchParams();
    if (newTerm) params.set("q", newTerm);
    if (newYear) params.set("year", newYear);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  function updateTerm(value) {
    setTerm(value);
    setPage(1);
    pushParams(value, year);
  }

  function updateYear(value) {
    setYear(value);
    setPage(1);
    pushParams(term, value);
  }

  function reset() {
    setTerm("");
    setYear("");
    setPage(1);
    router.replace(pathname, { scroll: false });
  }

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#16a34a]">
              Browse
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a]">
              Authors
            </h1>
            <p className="mt-2 text-sm text-[#64748b]">
              Search author names and affiliations while refining by conference year.
            </p>
          </div>
          <p className="font-mono text-xs text-[#16a34a]">
            {loading
              ? "Loading…"
              : `${filtered.length.toLocaleString()} authors · page ${safePage} of ${totalPages}`}
          </p>
        </div>

        <div className="mb-6 grid gap-3 border border-[#dcfce7] bg-[#f0fdf4] p-3 md:grid-cols-[1fr_150px_auto]">
          <input
            value={term}
            onChange={(e) => updateTerm(e.target.value)}
            placeholder="Search author or affiliation…"
            className="border border-[#dcfce7] bg-white px-3 py-2.5 text-sm text-[#0f172a] outline-none focus:border-[#16a34a]"
          />
          <select
            value={year}
            onChange={(e) => updateYear(e.target.value)}
            className="border border-[#dcfce7] bg-white px-3 py-2.5 text-sm text-[#64748b] outline-none focus:border-[#16a34a]"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={reset}
            className="border border-[#dcfce7] bg-white px-5 py-2.5 text-sm font-medium text-[#64748b] transition hover:border-[#16a34a] hover:text-[#166534]"
          >
            Reset
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {loading && (
            <p className="border border-[#dcfce7] bg-white p-4 text-sm text-[#16a34a]">
              Loading author data…
            </p>
          )}
          {!loading &&
            visible.map((author) => (
              <Link
                key={author.author_name}
                href={`/authors/${encodeURIComponent(author.author_name)}`}
                className="group border border-[#dcfce7] bg-white p-4 transition hover:border-[#16a34a]"
              >
                <h2 className="font-semibold text-[#0f172a] transition group-hover:text-[#166534]">
                  {author.author_name}
                </h2>
                <p className="mt-1.5 font-mono text-xs text-[#16a34a]">
                  {author.paper_count} papers · {author.attend_count} years
                </p>
                {author.affiliation_history && (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#64748b]">
                    {author.affiliation_history}
                  </p>
                )}
              </Link>
            ))}
        </div>

        <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </main>
  );
}
