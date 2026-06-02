"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

const citation = `@misc{hao2026icaconfpubs,
  title = {[Data Demo] ICAConfPubs: Dataset of and Website for Past ICA Conference Papers (2003-2018)},
  author = {Hao, Hongtao and Chen, Xinyue and Zhao, Yanling and Zhang, Jing},
  year = {2026},
  note = {Dataset and website for ICA conference papers},
  url = {https://icaconf.vercel.app/}
}`;

export default function CitationBlock() {
  const [copied, setCopied] = useState(false);

  async function copyCitation() {
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

  return (
    <div className="border border-[#dcfce7] bg-white p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-[#0f172a]">
        <div className="flex items-center gap-2">
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
    </div>
  );
}
