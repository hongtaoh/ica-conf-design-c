"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import { loadSessions } from "./clientData";

const pageSize = 30;

export default function BrowseSessions() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState(() => searchParams.get("q") || "");
  const [year, setYear] = useState(() => searchParams.get("year") || "");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    loadSessions()
      .then((data) => {
        if (active) setSessions(data);
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
          sessions.flatMap((s) => s.years || []).filter(Boolean),
        ),
      ).sort((a, b) => b - a),
    [sessions],
  );

  const searchableSessions = useMemo(
    () =>
      sessions.map((s) => ({
        ...s,
        searchText: [s.session, s.chair_name, s.division].join(" ").toLowerCase(),
      })),
    [sessions],
  );

  const filtered = useMemo(() => {
    const cleanTerm = term.trim().toLowerCase();
    return searchableSessions.filter(
      (s) =>
        (!year || (s.years || []).includes(Number(year))) &&
        (!cleanTerm || s.searchText.includes(cleanTerm)),
    );
  }, [searchableSessions, term, year]);

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
              Sessions
            </h1>
            <p className="mt-2 text-sm text-[#64748b]">
              Search session title, chair name, and division while refining by year.
            </p>
          </div>
          <p className="font-mono text-xs text-[#16a34a]">
            {loading
              ? "Loading…"
              : `${filtered.length.toLocaleString()} sessions · page ${safePage} of ${totalPages}`}
          </p>
        </div>

        <div className="mb-6 grid gap-3 border border-[#dcfce7] bg-[#f0fdf4] p-3 md:grid-cols-[1fr_150px_auto]">
          <input
            value={term}
            onChange={(e) => updateTerm(e.target.value)}
            placeholder="Search session, chair, or division…"
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

        <div className="grid gap-3">
          {loading && (
            <p className="border border-[#dcfce7] bg-white p-4 text-sm text-[#16a34a]">
              Loading session data…
            </p>
          )}
          {!loading &&
            visible.map((session) => (
              <Link
                key={session.session_id}
                href={`/sessions/${encodeURIComponent(session.session_id)}`}
                className="group flex items-start justify-between gap-4 border border-[#dcfce7] bg-white p-4 transition hover:border-[#16a34a]"
              >
                <div>
                  <h2 className="font-semibold text-[#0f172a] transition group-hover:text-[#166534]">
                    {session.session}
                  </h2>
                  <p className="mt-1 text-sm text-[#64748b]">
                    {session.division || "Division unknown"}
                  </p>
                  {session.chair_name && (
                    <p className="mt-1 text-xs text-[#16a34a]">
                      Chair: {session.chair_name}
                    </p>
                  )}
                </div>
                <span className="shrink-0 border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-1 font-mono text-xs text-[#166534]">
                  {session.paper_count} papers
                </span>
              </Link>
            ))}
        </div>

        <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </main>
  );
}
