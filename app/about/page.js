import Link from "next/link";
import CitationBlock from "../components/CitationBlock";
import { Code2, Sheet, FileText, Plug, Search, Users, LayoutList } from "lucide-react";

const googleSheetUrl =
  "https://docs.google.com/spreadsheets/d/1ZaMCJHQGvDqeY8k_WOPg6n0HlQJffiQFOMvKGRJnzLI/edit?usp=sharing";

export default function AboutPage() {
  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-3xl">

        {/* ── Header ── */}
        <header className="border-b border-[#dcfce7] pb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-[#16a34a]">
            About
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[#0f172a] md:text-5xl">
            ICAConfPubs
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#334155]">
            A searchable archive of International Communication Association
            conference papers, covering 16 years of annual conferences from
            2003 to 2018.
          </p>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-2 gap-px border border-[#dcfce7] bg-[#bbf7d0] sm:grid-cols-4">
            {[
              ["27,466", "papers"],
              ["21,038", "authors"],
              ["4,935", "sessions"],
              ["16", "years"],
            ].map(([n, label]) => (
              <div key={label} className="bg-white px-5 py-4">
                <p className="text-2xl font-bold tracking-tight text-[#0f172a]">
                  {n}
                </p>
                <p className="mt-0.5 font-mono text-xs text-[#16a34a]">{label}</p>
              </div>
            ))}
          </div>
        </header>


        {/* ── Access ── */}
        <section className="border-b border-[#dcfce7] py-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
            Access
          </h2>
          <ul className="mt-5 divide-y divide-[#e2e8f0]">
            {[
              {
                label: "Source code",
                note: "Source code and workspace for the app rebuild.",
                href: "https://github.com/hongtaoh/ica_conf_pubs",
                Icon: Code2,
              },
              {
                label: "Download data",
                note: "Full dataset as a public Google Sheet.",
                href: googleSheetUrl,
                Icon: Sheet,
              },
              {
                label: "Paper PDF",
                note: "Data demo paper describing the dataset and API endpoints.",
                href: "/paper.pdf",
                Icon: FileText,
              },
              {
                label: "API Docs",
                note: "REST endpoints for papers, authors, sessions, and semantic search.",
                href: "/api-docs",
                Icon: Plug,
              },
            ].map(({ label, note, href, Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="group flex items-center justify-between gap-6 py-4 transition hover:text-[#166534]"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0fdf4] text-[#16a34a] transition group-hover:bg-[#dcfce7] group-hover:text-[#166534]">
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <div>
                      <p className="font-medium text-[#0f172a] transition group-hover:text-[#166534]">
                        {label}
                      </p>
                      <p className="mt-0.5 text-sm text-[#64748b]">{note}</p>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-[#cbd5e1] transition group-hover:text-[#16a34a]">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Why it matters ── */}
        <section className="border-b border-[#dcfce7] py-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
            Why it matters
          </h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-[#334155]">
            <p>
              Conference papers surface emerging research before it reaches
              journals. They also capture work that may never be published,
              which is important for understanding publication bias and the full
              shape of communication scholarship.
            </p>
            <p>
              A structured dataset also enables scientometric work: tracing
              topic evolution, mapping collaboration networks, analyzing author
              mobility, and comparing activity across divisions, years, and
              research communities.
            </p>
          </div>
        </section>


        {/* ── How to use ── */}
        <section className="border-b border-[#dcfce7] py-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
            How to use the site
          </h2>
          <ol className="mt-5 space-y-0 divide-y divide-[#e2e8f0]">
            {[
              {
                n: "01",
                title: "Semantic search",
                body: "Paste a keyword, sentence, abstract, or full paragraph on the homepage. The query is embedded and matched against paper titles and abstracts using vector similarity.",
                href: "/",
                Icon: Search,
              },
              {
                n: "02",
                title: "Browse papers",
                body: "Filter all 27,466 paper records by title, abstract, author name, or year. Results update as you type.",
                href: "/papers",
                Icon: FileText,
              },
              {
                n: "03",
                title: "Browse authors",
                body: "Find any of the 21,038 authors by name or affiliation, and see every paper they contributed across conference years.",
                href: "/authors",
                Icon: Users,
              },
              {
                n: "04",
                title: "Browse sessions",
                body: "Explore 4,935 conference sessions by title, chair, or division. Each session links to its constituent papers.",
                href: "/sessions",
                Icon: LayoutList,
              },
            ].map(({ n, title, body, href, Icon }) => (
              <li key={n} className="group py-5">
                <Link href={href} className="flex items-start gap-5">
                  {/* <span className="mt-0.5 w-8 shrink-0 font-mono text-xs text-[#cbd5e1]">
                    {n}
                  </span> */}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0fdf4] text-[#16a34a] transition group-hover:bg-[#dcfce7] group-hover:text-[#166534]">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="font-semibold text-[#0f172a] transition group-hover:text-[#166534]">
                      {title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#64748b]">{body}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        

        {/* ── Citation ── */}
        <section className="border-b border-[#dcfce7] py-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
            Cite this paper
          </h2>
          <p className="mt-3 text-sm text-[#64748b]">
            Use this BibTeX entry when citing the dataset, paper, or website.
          </p>
          <div className="mt-5">
            <CitationBlock />
          </div>
        </section>

        {/* ── Limitations ── */}
        <section className="py-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#16a34a]">
            Limitations
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[#334155]">
            <p>
              The dataset covers 2003 to 2018. Conference programs after 2018
              are harder to parse because many are distributed as PDFs, and
              earlier years are not available in the same structured online
              format.
            </p>
            <p>
              Author names and affiliations are not fully deduplicated. Two
              scholars may share a name, and the same scholar may appear under
              slightly different affiliations across years.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
