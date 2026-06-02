"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PaperCard from "./PaperCard";
import { loadAuthorByName, loadPapersForAuthor } from "./clientData";

export default function AuthorDetailClient({ authorName }) {
  const router = useRouter();
  const [author, setAuthor] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([loadAuthorByName(authorName), loadPapersForAuthor(authorName)])
      .then(([authorData, paperData]) => {
        if (!active) return;
        setAuthor(authorData);
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
  }, [authorName]);

  if (loading) {
    return (
      <main className="px-6 py-10">
        <div className="mx-auto max-w-5xl border border-[#dcfce7] p-6 text-sm text-[#16a34a]">
          Loading author…
        </div>
      </main>
    );
  }

  if (!author) {
    return (
      <main className="px-6 py-10">
        <div className="mx-auto max-w-5xl border border-[#dcfce7] p-6 text-sm text-[#16a34a]">
          Author not found.
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
          <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">
            {author.author_name}
          </h1>
          <p className="mt-2 font-mono text-xs text-[#16a34a]">
            {author.paper_count} papers · {author.attend_count} conference years
          </p>
          {author.affiliation_history && (
            <p className="mt-4 text-sm leading-6 text-[#64748b]">
              {author.affiliation_history}
            </p>
          )}
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
