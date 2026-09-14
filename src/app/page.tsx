import Link from "next/link";
import { Upload, Download, ArrowRight, Clock, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#4fffb0]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#4fffb0]/20 bg-[#4fffb0]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4fffb0] animate-pulse" />
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#4fffb0]">
            secure file transfer
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-[1.05]">
  Share Files.
  <span className="text-[#4fffb0]"> Instantly.</span>
</h1>

        <p className="text-[#8884a0] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Transfer files securely between devices using a 6-character code or QR code. No account required. Files automatically expire for privacy.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
          <Link
            href="/upload"
            className="group inline-flex items-center justify-center gap-2 bg-[#4fffb0] text-[#0a0a0f] px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-[#3aefa0] transition-all duration-150 hover:-translate-y-0.5"
          >
            <Upload size={16} strokeWidth={2.5} />
            Upload a file
            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/receive"
            className="inline-flex items-center justify-center gap-2 border border-[#2a2a38] text-white px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:border-[#4fffb0] hover:text-[#4fffb0] transition-all duration-150"
          >
            <Download size={16} strokeWidth={2} />
            Enter code to receive
          </Link>
        </div>

      <div className="flex justify-center gap-8 text-center mt-10">
  <div>
    <p className="text-2xl font-bold text-white">50 MB</p>
    <p className="text-xs text-[#8884a0]">Max File Size</p>
  </div>

  <div>
    <p className="text-2xl font-bold text-white">6 Digit</p>
    <p className="text-xs text-[#8884a0]">Access Code</p>
  </div>

  <div>
    <p className="text-2xl font-bold text-white">10 Min</p>
    <p className="text-xs text-[#8884a0]">Auto Expiry</p>
  </div>
</div>
        {/* How it works */}
        <div className="text-left max-w-2xl mx-auto">
          <p className="font-mono text-[10px] tracking-[.12em] uppercase text-[#8884a0] mb-4">
            how it works
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { num: "01", title: "Upload your file", desc: "Drop any doc, image, or archive up to 50 MB" },
              { num: "02", title: "Get a 6-digit code", desc: "A temporary code is generated instantly" },
              { num: "03", title: "Receive anywhere", desc: "Enter the code on any device to download" },
            ].map((step) => (
              <div
                key={step.num}
                className="flex-1 bg-[#111118] border border-[#2a2a38] rounded-xl p-4 hover:border-[#4fffb0]/30 transition-colors"
              >
                <span className="font-mono text-[11px] text-[#4fffb0] mb-2 block">{step.num}</span>
                <p className="text-white text-sm font-semibold mb-1">{step.title}</p>
                <p className="text-[#8884a0] text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-6 pb-24">
        <FeatureCard
          icon={<Upload size={22} strokeWidth={1.5} />}
          title="Quick Upload"
          description="Upload documents and images instantly from any device."
        />
        <FeatureCard
          icon={<Download size={22} strokeWidth={1.5} />}
          title="Easy Access"
          description="Enter a secure code on another device to get your file."
        />
        <FeatureCard
          icon={<Shield size={22} strokeWidth={1.5} />}
          title="Secure Transfer"
          description="Files are temporary and accessed through protected links."
        />
        <FeatureCard
          icon={<Clock size={22} strokeWidth={1.5} />}
          title="Auto Expiry"
          description="Files expire automatically after a limited time."
        />
      </section>
<section className="max-w-5xl mx-auto px-6 pb-20 text-center">
  <h2 className="text-xl font-bold text-white mb-6">
    Built With
  </h2>

  <div className="flex flex-wrap justify-center gap-3">
    {[
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Vercel",
    ].map((tech) => (
      <span
        key={tech}
        className="px-4 py-2 rounded-full bg-[#111118] border border-[#2a2a38] text-sm text-[#4fffb0]"
      >
        {tech}
      </span>
    ))}
  </div>
</section>
<section className="max-w-4xl mx-auto px-6 pb-20">
  <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-6">
    <h2 className="text-white text-xl font-bold mb-4">
      Why Vanishly?
    </h2>

    <ul className="space-y-2 text-[#8884a0]">
      <li>✓ No account or login required</li>
      <li>✓ Share using access code or QR code</li>
      <li>✓ Direct upload to cloud storage</li>
      <li>✓ Automatic file expiration</li>
      <li>✓ Mobile and desktop friendly</li>
    </ul>
  </div>
</section>
      {/* Footer strip */}
      <footer className="border-t border-[#2a2a38] py-8 text-center">
  <p className="font-mono text-[11px] text-[#8884a0] tracking-widest uppercase mb-4">
    no login · secure transfer · auto-expiry
  </p>

  <a
    href="https://github.com/arundodamani27/vanishly"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 text-[#8884a0] hover:text-[#4fffb0] transition-colors"
  >
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.76.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
    </svg>
    View Source Code
  </a>

  <p className="text-xs text-[#666] mt-4">
    Built by Arun
  </p>
</footer>
    </main>
  );
}