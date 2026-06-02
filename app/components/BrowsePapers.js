"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import PaperCard from "./PaperCard";
import Pagination from "./Pagination";
import { loadPapers } from "./clientData";

const pageSize = 20;

export default function BrowsePapers() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState(() => searchParams.get("q") || "");
  const [year, setYear] = useState(() => searchParams.get("year") || "");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    loadPapers()
      .then((data) => {
        if (active) setPapers(data);
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
      Array.from(new Set(papers.map((p) => p.year).filter(Boolean))).sort(
        (a, b) => b - a,
      ),
    [papers],
  );

  const searchablePapers = useMemo(
    () =>
      papers.map((p) => ({
        ...p,
        searchText: [p.title, p.abstract, ...(p.author_names || [])]
          .join(" ")
          .toLowerCase(),
      })),
    [papers],
  );

  const filtered = useMemo(() => {
    const cleanTerm = term.trim().toLowerCase();
    return searchablePapers.filter(
      (p) =>
        (!year || Number(p.year) === Number(year)) &&
        (!cleanTerm || p.searchText.includes(cleanTerm)),
    );
  }, [searchablePapers, term, year]);

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
              Papers
            </h1>
            <p className="mt-2 text-sm text-[#64748b]">
              Search title, abstract, and author names while refining by year.
            </p>
          </div>
          <p className="font-mono text-xs text-[#16a34a]">
            {loading
              ? "Loading…"
              : `${filtered.length.toLocaleString()} papers · page ${safePage} of ${totalPages}`}
          </p>
        </div>

        <div className="mb-6 grid gap-3 border border-[#dcfce7] bg-[#f0fdf4] p-3 md:grid-cols-[1fr_150px_auto]">
          <input
            value={term}
            onChange={(e) => updateTerm(e.target.value)}
            placeholder="Search title, abstract, or author…"
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

        <div className="border border-[#dcfce7] bg-white px-6">
          {loading && (
            <p className="py-10 text-sm text-[#16a34a]">Loading paper data…</p>
          )}
          {!loading &&
            visible.map((paper, index) => (
              <PaperCard
                key={paper.paper_id}
                paper={paper}
                rank={(safePage - 1) * pageSize + index + 1}
              />
            ))}
          {!loading && !visible.length && (
            <p className="py-10 text-sm text-[#16a34a]">No papers found.</p>
          )}
        </div>

        <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </main>
  );
}
