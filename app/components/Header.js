import Link from "next/link";

const links = [
  ["Papers", "/papers"],
  ["Authors", "/authors"],
  ["Sessions", "/sessions"],
  ["About", "/about"],
  ["API", "/api-docs"],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#bbf7d0] bg-[#f0fdf4]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-[#0f172a]">
            ICAConfPubs
          </span>
          <span className="hidden text-xs text-[#16a34a] sm:inline">
            2003–2018
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-[#166534]">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="transition hover:text-[#14532d]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
