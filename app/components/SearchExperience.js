"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, Search } from "lucide-react";
import PaperCard from "./PaperCard";

const exampleQueries = [
  "I am interested in how social media misinformation circulates during elections, how people correct false claims, and whether partisan identity shapes what audiences believe.",
  "health communication and patient participation",
  "artificial intelligence and communication work",
  "online communities and social support",
  "I want to find papers about video games, media effects, youth, and how interactive entertainment changes social behavior over time.",
];

function TypewriterPlaceholder({ hidden }) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (hidden) return undefined;

    const current = exampleQueries[exampleIndex];
    const doneTyping = charCount >= current.length;
    const delay = doneTyping ? 1600 : 36;
    const timeout = window.setTimeout(() => {
      if (doneTyping) {
        setCharCount(0);
        setExampleIndex((v) => (v + 1) % exampleQueries.length);
      } else {
        setCharCount((v) => v + 1);
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [charCount, exampleIndex, hidden]);

  if (hidden) return null;

  return (
    <div className="pointer-events-none absolute inset-x-4 top-4 z-10 text-base leading-7 text-[#94a3b8]">
      {exampleQueries[exampleIndex].slice(0, charCount)}
      <span className="ml-0.5 inline-block h-5 w-px translate-y-1 bg-[#16a34a]" />
    </div>
  );
}

export default function SearchExperience() {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(10);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const queryLabel = useMemo(
    () => (searched ? `Top ${topK} semantic matches` : null),
    [searched, topK],
  );

  async function runSearch(nextQuery = query) {
    const cleanQuery = nextQuery.trim();
    if (!cleanQuery) return;

    setQuery(cleanQuery);
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(cleanQuery)}&k=${topK}`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Search failed");
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {/* Hero / search */}
      <section className="border-b border-[#dcfce7] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          {/* Stats row */}
          <p className="mb-6 font-mono text-xs tracking-wide text-[#16a34a]">
            2003–2018 &nbsp;·&nbsp; 27,466 papers &nbsp;·&nbsp; 21,038 authors
            &nbsp;·&nbsp; 4,935 sessions
          </p>

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#0f172a] md:text-5xl">
            Search ICA conference papers.
          </h1>
          <p className="mt-4 text-base leading-7 text-[#64748b]">
            Enter a keyword, sentence, or paragraph. The system finds the most
            relevant papers from 27,466 ICA conference papers (2003–2018) using
            semantic similarity.
          </p>

          {/* Search form */}
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              runSearch();
            }}
          >
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Research interest"
                rows={4}
                autoComplete="off"
                className="w-full resize-none border border-[#dcfce7] bg-white px-4 py-4 text-base leading-7 text-[#0f172a] outline-none transition focus:border-[#16a34a]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    runSearch();
                  }
                }}
              />
              <TypewriterPlaceholder hidden={Boolean(query)} />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <select
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="border border-[#dcfce7] bg-white px-3 py-2.5 text-sm text-[#64748b] outline-none focus:border-[#16a34a]"
              >
                {[5, 10, 15, 20, 25].map((v) => (
                  <option key={v} value={v}>
                    top {v}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532d]"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                Search papers
              </button>
            </div>
          </form>

          {/* Example queries */}
          <div className="mt-5 flex flex-col gap-1.5">
            {exampleQueries.slice(0, 3).map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => runSearch(ex)}
                className="group flex items-start gap-2 border-l-2 border-[#bbf7d0] px-3 py-1 text-left text-xs leading-5 text-[#16a34a] transition hover:border-[#16a34a] hover:text-[#0f172a]"
              >
                {ex.length > 110 ? `${ex.slice(0, 110)}…` : ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      {(searched || loading) && (
        <section className="border-b border-[#dcfce7] px-6 py-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-baseline justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#0f172a]">
                  {queryLabel}
                </h2>
                <p className="mt-0.5 text-xs text-[#94a3b8]">
                  Showing only the top {topK} Pinecone matches for &ldquo;{query}&rdquo;
                </p>
              </div>
              {loading && (
                <Loader2 size={18} className="animate-spin text-[#16a34a]" />
              )}
            </div>

            {error && (
              <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="divide-y divide-[#dcfce7]">
              {results.map((paper, index) => (
                <PaperCard
                  key={paper.paper_id}
                  paper={paper}
                  rank={index + 1}
                  openPaperInNewTab={searched}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom links */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#16a34a]">
            More
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Browse papers", "/papers"],
              ["Browse authors", "/authors"],
              ["Browse sessions", "/sessions"],
              ["About", "/about"],
              ["API docs", "/api-docs"],
              ["GitHub", "https://github.com/hongtaoh/ica-conf-app-new"],
              [
                "Download data",
                "https://docs.google.com/spreadsheets/d/1ZaMCJHQGvDqeY8k_WOPg6n0HlQJffiQFOMvKGRJnzLI/edit?usp=sharing",
              ],
              ["Paper PDF", "/paper.pdf"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center justify-between border border-[#dcfce7] px-4 py-3 text-sm text-[#0f172a] transition hover:border-[#16a34a] hover:text-[#166534]"
              >
                {label}
                <ArrowUpRight
                  size={14}
                  className="text-[#86efac] transition group-hover:text-[#16a34a]"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
