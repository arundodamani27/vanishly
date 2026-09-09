import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 border-b border-[#2a2a38] bg-[#0a0a0f]/80 backdrop-blur-md">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#4fffb0] flex items-center justify-center">
          <svg width="14" height="14" fill="none" stroke="#0a0a0f" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-black text-lg tracking-tight text-white">
          vanishly<span className="text-[#4fffb0]">share</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-2">
        <Link
          href="/receive"
          className="px-4 py-2 rounded-lg border border-[#2a2a38] text-[#8884a0] font-mono text-xs tracking-wide uppercase hover:border-[#4fffb0]/40 hover:text-[#4fffb0] transition-all duration-150"
        >
          receive
        </Link>
        <Link
          href="/upload"
          className="px-4 py-2 rounded-lg bg-[#4fffb0] text-[#0a0a0f] font-bold text-xs tracking-wide uppercase hover:bg-[#3aefa0] transition-all duration-150"
        >
          upload
        </Link>
      </div>

    </nav>
  );
}