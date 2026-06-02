"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const endpoints = [
  {
    method: "GET",
    path: "/api/search",
    description: "Semantic search over ICA paper title and abstract embeddings.",
    params: [
      ["q", "Required. Keyword, sentence, abstract, or paragraph."],
      ["k", "Optional. Number of results, 1–25. Default: 10."],
    ],
    example:
      "/api/search?q=social%20media%20misinformation%20and%20political%20polarization&k=5",
  },
  {
    method: "GET",
    path: "/api/papers",
    description: "Paginated paper records with optional filters.",
    params: [
      ["page", "Optional. Page number. Default: 1."],
      ["limit", "Optional. Items per page, max 100. Default: 25."],
      ["title_contains", "Optional. Case-insensitive title match."],
      ["abstract_contains", "Optional. Case-insensitive abstract match."],
      ["has_author", "Optional. Case-insensitive author name match."],
      ["year", "Optional. Exact conference year."],
      ["paper_type", "Optional. Exact paper type."],
      ["session_contains", "Optional. Case-insensitive session title match."],
      ["session_id", "Optional. Exact session ID."],
    ],
    example: "/api/papers?title_contains=communication&year=2003&limit=10",
  },
  {
    method: "GET",
    path: "/api/papers/[paper_id]",
    description: "Detailed record for one paper.",
    params: [["paper_id", "Required in path. Example: 2003-8726c2764aa326c8."]],
    example: "/api/papers/2003-8726c2764aa326c8",
  },
  {
    method: "GET",
    path: "/api/authors",
    description: "Paginated author records with optional filters.",
    params: [
      ["page", "Optional. Page number. Default: 1."],
      ["limit", "Optional. Items per page, max 100. Default: 25."],
      ["author_name", "Optional. Case-insensitive author name match."],
      ["affiliation_contains", "Optional. Case-insensitive affiliation match."],
      ["year_attended", "Optional. Exact conference year."],
      ["min_attend_count", "Optional. Minimum attended-year count."],
      ["min_paper_count", "Optional. Minimum paper count."],
    ],
    example: "/api/authors?author_name=Claes&limit=5",
  },
  {
    method: "GET",
    path: "/api/sessions",
    description: "Paginated session records with optional filters.",
    params: [
      ["page", "Optional. Page number. Default: 1."],
      ["limit", "Optional. Items per page, max 100. Default: 25."],
      ["session", "Optional. Case-insensitive session title match."],
      ["chair_name", "Optional. Case-insensitive chair name match."],
      ["division", "Optional. Case-insensitive division match."],
      ["year", "Optional. Exact conference year."],
      ["paper_count", "Optional. Exact paper count."],
    ],
    example: "/api/sessions?division=Game%20Studies&limit=5",
  },
];

function CopyableExample({ path }) {
  const [copied, setCopied] = useState(false);
  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : path;

  async function copy() {
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = fullUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border border-[#dcfce7] bg-[#f0fdf4] px-3 py-2">
        <span className="font-mono text-xs text-[#64748b]">Example</span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 border border-[#dcfce7] bg-white px-2 py-1 text-xs text-[#64748b] transition hover:border-[#16a34a] hover:text-[#166534]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-auto bg-[#0f172a] p-4 text-xs leading-6 text-[#86efac]">
        {fullUrl}
      </pre>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <section className="border-b border-[#dcfce7] pb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-[#16a34a]">
            API Documentation
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-[#0f172a]">
            Programmatic access to ICA conference data.
          </h1>
          <p className="mt-5 text-base leading-8 text-[#334155]">
            These endpoints serve the same 2003–2018 paper, author, and session
            data used by the web interface. All responses are JSON. List
            endpoints are paginated.
          </p>
          <div className="mt-5 border border-[#dcfce7] bg-[#f0fdf4] px-4 py-3 text-sm text-[#64748b]">
            <span className="font-medium text-[#0f172a]">Base URL: </span>
            <span className="font-mono">
              {typeof window !== "undefined"
                ? window.location.origin
                : "https://your-deployment-url"}
            </span>
          </div>
        </section>

        {/* Endpoints */}
        <section className="grid gap-5 py-8">
          {endpoints.map((endpoint) => (
            <article
              key={endpoint.path}
              className="border border-[#dcfce7] bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#0f172a] px-2 py-0.5 font-mono text-xs font-semibold text-[#86efac]">
                  {endpoint.method}
                </span>
                <code className="font-mono text-base font-semibold text-[#0f172a]">
                  {endpoint.path}
                </code>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#64748b]">
                {endpoint.description}
              </p>
              <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
                    Parameters
                  </h2>
                  <dl className="mt-3 grid gap-2 text-sm">
                    {endpoint.params.map(([name, body]) => (
                      <div
                        key={name}
                        className="border border-[#dcfce7] bg-[#f0fdf4] p-3"
                      >
                        <dt className="font-mono font-semibold text-[#0f172a]">
                          {name}
                        </dt>
                        <dd className="mt-1 leading-6 text-[#64748b]">{body}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
                    Example
                  </h2>
                  <CopyableExample path={endpoint.example} />
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Response shape */}
        <section className="border border-[#dcfce7] bg-white p-5">
          <h2 className="font-bold text-[#0f172a]">Response shape</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">
            List endpoints return pagination metadata plus an{" "}
            <code className="font-mono text-[#166534]">items</code> array.
            Semantic search returns{" "}
            <code className="font-mono text-[#166534]">query</code>,{" "}
            <code className="font-mono text-[#166534]">count</code>, and{" "}
            <code className="font-mono text-[#166534]">results</code>.
          </p>
          <div className="mt-4">
            <pre className="overflow-auto bg-[#0f172a] p-4 text-sm leading-6 text-[#86efac]">{`{
  "page": 1,
  "limit": 10,
  "total": 124,
  "totalPages": 13,
  "items": [
    {
      "paper_id": "2003-...",
      "title": "...",
      "abstract": "...",
      "year": 2003,
      "author_names": ["..."],
      "session_info": { "...": "..." }
    }
  ]
}`}</pre>
          </div>
        </section>
      </div>
    </main>
  );
}
