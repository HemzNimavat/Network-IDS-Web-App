import Link from "next/link";
import { Radar } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium">
          <Radar className="w-5 h-5 text-signal" strokeWidth={1.75} />
          <span>
            IDS<span className="text-muted">//</span>
          </span>
        </Link>
        <nav className="flex items-center gap-8 font-mono text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">
            overview
          </Link>
          <Link href="/results" className="hover:text-ink transition-colors">
            results
          </Link>
          <Link
            href="/demo"
            className="text-ink border border-line px-3 py-1.5 rounded hover:border-signal hover:text-signal transition-colors"
          >
            live demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
