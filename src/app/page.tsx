import Link from "next/link";
import {
  Upload,
  Download,
  ArrowRight,
  Timer,
  KeyRound,
  ShieldCheck,
  QrCode,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const STEPS = [
  {
    num: "1",
    title: "Drop your file",
    desc: "Any file up to 50MB — video and audio aren't supported.",
  },
  {
    num: "2",
    title: "Get your code",
    desc: "A 6-character code and QR are generated instantly.",
  },
  {
    num: "3",
    title: "Open it anywhere",
    desc: "Enter the code or scan the QR on the other device.",
  },
];

const TRUST_POINTS = [
  {
    icon: KeyRound,
    title: "No account",
    desc: "Nothing to sign up for, nothing tied to your identity.",
  },
  {
    icon: ShieldCheck,
    title: "Code-gated access",
    desc: "Only someone with the exact code can open the file.",
  },
  {
    icon: Timer,
    title: "Ten-minute lifespan",
    desc: "Every file clears itself out automatically, no cleanup needed.",
  },
  {
    icon: QrCode,
    title: "Works on any device",
    desc: "Scan the QR or type the code — no app install either side.",
  },
];

const STACK = ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-24">
        <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[500px] h-[260px] bg-[#4fffb0]/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-7 px-3 py-1 rounded-full border border-[#2a2a38]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4fffb0] opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4fffb0]" />
              </span>
              <span className="font-mono text-[11px] text-[#8884a0]">
                storage online, nothing kept
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-[1.05] max-w-lg">
              Send a file.
              <br />
              It&apos;s gone in ten minutes.
            </h1>

            <p className="text-[#8884a0] text-lg mb-10 max-w-md leading-relaxed">
              Drop a file, get a 6-digit code, hand it off to any device. No
              account, no history — Vanishly clears everything out on its
              own.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                href="/upload"
                className="group inline-flex items-center justify-center gap-2 bg-[#4fffb0] text-[#0a0a0f] px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-[#3aefa0] transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4fffb0]"
              >
                <Upload size={16} strokeWidth={2.5} />
                Upload a file
                <ArrowRight
                  size={14}
                  strokeWidth={2.5}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>

              <Link
                href="/receive"
                className="inline-flex items-center justify-center gap-2 border border-[#2a2a38] text-white px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:border-[#4fffb0] hover:text-[#4fffb0] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4fffb0]"
              >
                <Download size={16} strokeWidth={2} />
                Enter a code
              </Link>
            </div>

            <div className="flex gap-8">
              <div>
                <p className="text-xl font-bold text-white">50MB</p>
                <p className="text-xs text-[#8884a0]">max file size</p>
              </div>
              <div className="w-px bg-[#2a2a38]" />
              <div>
                <p className="text-xl font-bold text-white">6 digits</p>
                <p className="text-xs text-[#8884a0]">access code</p>
              </div>
              <div className="w-px bg-[#2a2a38]" />
              <div>
                <p className="text-xl font-bold text-white">10 min</p>
                <p className="text-xs text-[#8884a0]">auto expiry</p>
              </div>
            </div>
          </div>

          {/* Expiry ring — the one deliberate motion moment on the page */}
          <div
            className="hidden lg:flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              className="motion-reduce:[&_.ring-drain]:animation-none"
            >
              <circle
                cx="110"
                cy="110"
                r="92"
                fill="none"
                stroke="#2a2a38"
                strokeWidth="2"
              />
              <circle
                className="ring-drain"
                cx="110"
                cy="110"
                r="92"
                fill="none"
                stroke="#4fffb0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="578"
                transform="rotate(-90 110 110)"
              />
              <foreignObject x="55" y="55" width="110" height="110">
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <span className="font-mono text-2xl font-medium text-white tracking-wider">
                    X9K2QP
                  </span>
                  <span className="font-mono text-[10px] text-[#8884a0]">
                    expires in 10:00
                  </span>
                </div>
              </foreignObject>
            </svg>
            <style>{`
              @keyframes ring-drain {
                from { stroke-dashoffset: 0; }
                to { stroke-dashoffset: 578; }
              }
              .ring-drain {
                animation: ring-drain 10s linear infinite;
              }
              @media (prefers-reduced-motion: reduce) {
                .ring-drain { animation: none; stroke-dashoffset: 300; }
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* How it works — connected sequence, not boxed cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white mb-10">How it works</h2>

        <div className="relative grid sm:grid-cols-3 gap-8 sm:gap-6">
          <div
            className="hidden sm:block absolute top-5 left-[16.5%] right-[16.5%] h-px bg-[#2a2a38]"
            aria-hidden="true"
          />

          {STEPS.map((step) => (
            <div key={step.num} className="relative">
              <div className="w-10 h-10 rounded-full bg-[#111118] border border-[#2a2a38] flex items-center justify-center font-mono text-sm text-[#4fffb0] mb-4 relative z-10">
                {step.num}
              </div>
              <p className="text-white text-base font-semibold mb-1.5">
                {step.title}
              </p>
              <p className="text-[#8884a0] text-sm leading-relaxed max-w-[26ch]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust — manifesto + checklist, replaces the old duplicated card grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10 lg:gap-16 bg-[#111118] border border-[#2a2a38] rounded-2xl p-8 sm:p-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 leading-snug">
              Nothing to manage, nothing left behind.
            </h2>
            <p className="text-[#8884a0] text-sm leading-relaxed max-w-sm">
              Vanishly isn&apos;t trying to be a file host. It&apos;s a hand-off — the
              file exists just long enough to reach the other device, then
              it&apos;s deleted whether you remember to or not.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
            {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3.5">
                <Icon
                  size={18}
                  strokeWidth={1.75}
                  className="text-[#4fffb0] mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-white text-sm font-semibold mb-1">
                    {title}
                  </p>
                  <p className="text-[#8884a0] text-[13px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a38] py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="text-[11px] text-[#8884a0] px-2.5 py-1 rounded-md bg-[#111118] border border-[#2a2a38]"
              >
                {tech}
              </span>
            ))}
          </div>

          <a
            href="https://github.com/arundodamani27/vanishly"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#8884a0] hover:text-[#4fffb0] transition-colors text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4fffb0] rounded"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.76.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
            </svg>
            Source
          </a>
        </div>

        <p className="text-center text-xs text-[#666] mt-8">Built by Arun</p>
      </footer>
    </main>
  );
}