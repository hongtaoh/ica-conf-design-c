"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy } from "lucide-react";
import { loadPaperById } from "./clientData";

export default function PaperDetailClient({ paperId }) {
  const router = useRouter();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    loadPaperById(paperId)
      .then((data) => {
        if (active) setPaper(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [paperId]);

  const citation = useMemo(() => {
    if (!paper) return "";
    const conferenceNumber = Number(paper.year) - 1950;
    const authors = paper.author_names?.join(" and ") || "";

    return `@article{ica-${paper.paper_id},
  title={${paper.title}},
  author={${authors}},
  journal={${conferenceNumber}th Annual Conference of the International Communication Association (ICA)},
  year={${paper.year}},
  publisher={ICA}
}`;
  }, [paper]);

  async function copyCitation() {
    if (!citation) return;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(citation);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = citation;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (loading) {
    return (
      <main className="px-6 py-10">
        <div className="mx-auto max-w-4xl border border-[#dcfce7] p-6 text-sm text-[#16a34a]">
          Loading paper…
        </div>
      </main>
    );
  }

  if (!paper) {
    return (
      <main className="px-6 py-10">
        <div className="mx-auto max-w-4xl border border-[#dcfce7] p-6 text-sm text-[#16a34a]">
          Paper not found.
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-10">
      <article className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#64748b] transition hover:text-[#166534]"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="border border-[#dcfce7] bg-white p-6 md:p-9">
          {/* Meta chips */}
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-0.5 font-mono text-xs text-[#166534]">
              {paper.year}
            </span>
            <span className="border border-[#dcfce7] bg-[#f0fdf4] px-2 py-0.5 font-mono text-xs text-[#64748b]">
              {paper.paper_type}
            </span>
            {paper.division && (
              <span className="border border-[#dcfce7] bg-[#f0fdf4] px-2 py-0.5 font-mono text-xs text-[#64748b]">
                {paper.division}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#0f172a] md:text-4xl">
            {paper.title}
          </h1>

          {/* Authors */}
          <section className="mt-8 border-y border-[#dcfce7] py-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
              Authors
            </h2>
            <div className="mt-3 grid gap-2">
              {(paper.authorships || []).map((author) => (
                <p
                  key={`${author.position}-${author.author_name}`}
                  className="text-sm text-[#64748b]"
                >
                  <Link
                    href={`/authors/${encodeURIComponent(author.author_name)}`}
                    className="font-medium text-[#0f172a] transition hover:text-[#166534] hover:underline"
                  >
                    {author.author_name}
                  </Link>
                  {author.author_affiliation ? ` · ${author.author_affiliation}` : ""}
                </p>
              ))}
            </div>
          </section>

          {/* Abstract */}
          <section className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
              Abstract
            </h2>
            <p className="mt-3 text-base leading-8 text-[#334155]">
              {paper.abstract || "No abstract available."}
            </p>
          </section>

          {/* Session / Division */}
          <dl className="mt-8 grid gap-4 border border-[#dcfce7] bg-[#f0fdf4] p-4 text-sm md:grid-cols-2">
            <div>
              <dt className="font-medium text-[#0f172a]">Session</dt>
              <dd className="mt-1 text-[#64748b]">
                {paper.session_info?.session_id ? (
                  <Link
                    href={`/sessions/${encodeURIComponent(paper.session_info.session_id)}`}
                    className="transition hover:text-[#166534] hover:underline"
                  >
                    {paper.session || paper.session_info.session}
                  </Link>
                ) : (
                  paper.session || "N/A"
                )}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-[#0f172a]">Division</dt>
              <dd className="mt-1 text-[#64748b]">{paper.division || "N/A"}</dd>
            </div>
          </dl>
        </div>

        {/* BibTeX */}
        <section className="mt-5 border border-[#dcfce7] bg-white p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
              <Copy size={15} />
              BibTeX
            </div>
            <button
              type="button"
              onClick={copyCitation}
              className="border border-[#dcfce7] bg-[#f0fdf4] px-3 py-1.5 text-xs font-medium text-[#64748b] transition hover:border-[#16a34a] hover:text-[#166534]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-auto bg-[#0f172a] p-4 text-sm leading-6 text-[#86efac]">
            {citation}
          </pre>
        </section>
      </article>
    </main>
  );
}
