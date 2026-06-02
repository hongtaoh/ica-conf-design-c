"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PaperCard from "./PaperCard";
import { loadPapersForSession, loadSessionById } from "./clientData";

export default function SessionDetailClient({ sessionId }) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([loadSessionById(sessionId), loadPapersForSession(sessionId)])
      .then(([sessionData, paperData]) => {
        if (!active) return;
        setSession(sessionData);
        setPapers(
          paperData.slice().sort((a, b) => Number(b.year) - Number(a.year)),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <main className="px-6 py-10">
        <div className="mx-auto max-w-5xl border border-[#dcfce7] p-6 text-sm text-[#16a34a]">
          Loading session…
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="px-6 py-10">
        <div className="mx-auto max-w-5xl border border-[#dcfce7] p-6 text-sm text-[#16a34a]">
          Session not found.
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#64748b] transition hover:text-[#166534]"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <section className="mb-6 border border-[#dcfce7] bg-white p-6">
          {/* Chips */}
          <div className="mb-4 flex flex-wrap gap-2">
            {session.session_type && (
              <span className="border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-0.5 font-mono text-xs text-[#166534]">
                {session.session_type}
              </span>
            )}
            {(session.years || []).map((year) => (
              <span
                key={year}
                className="border border-[#dcfce7] bg-[#f0fdf4] px-2 py-0.5 font-mono text-xs text-[#64748b]"
              >
                {year}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#0f172a]">
            {session.session}
          </h1>

          <dl className="mt-5 grid gap-4 text-sm md:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
                Division
              </dt>
              <dd className="mt-1 text-[#334155]">{session.division || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
                Chair
              </dt>
              <dd className="mt-1 text-[#334155]">{session.chair_name || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
                Papers
              </dt>
              <dd className="mt-1 font-mono text-[#334155]">{session.paper_count}</dd>
            </div>
          </dl>
        </section>

        <div className="border border-[#dcfce7] bg-white px-6">
          {papers.map((paper, index) => (
            <PaperCard key={paper.paper_id} paper={paper} rank={index + 1} />
          ))}
        </div>
      </div>
    </main>
  );
}
