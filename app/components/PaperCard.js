import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function PaperCard({ paper, rank, openPaperInNewTab = false }) {
  const abstract = paper.abstract || "No abstract available.";
  const authors = paper.author_names || [];
  const score =
    typeof paper.score === "number" ? `${Math.round(paper.score * 100)}%` : null;
  const paperHref = `/papers/${encodeURIComponent(paper.paper_id)}`;
  const paperTarget = openPaperInNewTab ? "_blank" : undefined;
  const paperRel = openPaperInNewTab ? "noopener noreferrer" : undefined;

  return (
    <article className="group py-5 transition hover:bg-[#f0fdf4]">
      <div className="flex items-start gap-4">
        {/* Rank */}
        <span className="mt-0.5 w-6 shrink-0 font-mono text-xs text-[#86efac]">
          {rank ? String(rank).padStart(2, "0") : ""}
        </span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Meta chips */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {paper.year && (
              <span className="border border-[#bbf7d0] bg-[#f0fdf4] px-1.5 py-0.5 font-mono text-[11px] text-[#166534]">
                {paper.year}
              </span>
            )}
            {paper.division && (
              <span className="border border-[#bbf7d0] bg-[#f0fdf4] px-1.5 py-0.5 font-mono text-[11px] text-[#166534]">
                {paper.division}
              </span>
            )}
            {score && (
              <span className="border border-[#bbf7d0] bg-[#f0fdf4] px-1.5 py-0.5 font-mono text-[11px] text-[#166534]">
                {score}
              </span>
            )}
          </div>

          {/* Title */}
          <Link
            href={paperHref}
            target={paperTarget}
            rel={paperRel}
            className="block"
          >
            <h3 className="text-base font-semibold leading-snug text-[#0f172a] transition hover:text-[#166534]">
              {paper.title}
            </h3>
          </Link>

          {/* Authors */}
          <p className="mt-1.5 text-sm text-[#64748b]">
            {authors.length
              ? authors.map((author, index) => (
                  <span key={author}>
                    <Link
                      href={`/authors/${encodeURIComponent(author)}`}
                      className="transition hover:text-[#166534] hover:underline"
                    >
                      {author}
                    </Link>
                    {index < authors.length - 1 ? ", " : ""}
                  </span>
                ))
              : "Unknown authors"}
          </p>

          {/* Abstract */}
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#64748b]">
            {abstract}
          </p>
        </div>

        {/* Arrow */}
        <Link
          href={paperHref}
          target={paperTarget}
          rel={paperRel}
          aria-label={`Open ${paper.title}`}
          className="mt-0.5 shrink-0 text-[#86efac] transition group-hover:text-[#166534]"
        >
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
