"use client";

import { useEffect, useState } from "react";
import { Download, AlertCircle, CheckCircle } from "lucide-react";

type AccessResult = {
  files?: {
    fileName: string;
    downloadUrl: string;
  }[];
  error?: string;
};

export default function ReceiveCard() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<AccessResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrCode = params.get("code");
    if (qrCode) setTimeout(() => setCode(sanitizeCode(qrCode)), 0);
  }, []);

  function sanitizeCode(value: string) {
    // Access codes are alphanumeric only — strip anything else on type or paste
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  }

  async function handleAccess() {
    if (!code.trim()) return;
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: code }),
      });
      const data = await res.json();

      if (!res.ok && !data?.error) {
        setResult({ error: "Invalid or expired code" });
      } else if (!data?.files && !data?.error) {
        setResult({ error: "No files found for this code" });
      } else {
        setResult(data);
      }
      setCode("");
    } catch {
      setResult({ error: "Something went wrong" });
    }
    setLoading(false);
  }

  async function downloadAll(files: { fileName: string; downloadUrl: string }[]) {
    for (const file of files) {
      const link = document.createElement("a");
      link.href = file.downloadUrl;
      link.download = file.fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Small stagger so the browser doesn't block multiple simultaneous downloads
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return (
    <div className="bg-[#111118] rounded-3xl p-6 sm:p-10 border border-[#2a2a38] shadow-2xl max-w-2xl mx-auto">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#4fffb0]/10 flex items-center justify-center mx-auto mb-4">
          <Download size={26} strokeWidth={1.5} className="text-[#4fffb0]" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">
          Receive <span className="text-[#4fffb0]">files</span>
        </h1>
        <p className="text-[#8884a0] text-sm">
          Enter the 6-character code from the sender to retrieve your file.
        </p>
      </div>

      {/* Code input + button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          value={code}
          onChange={(e) => setCode(sanitizeCode(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && handleAccess()}
          placeholder="A1B2C3"
          maxLength={6}
          className="flex-1 bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-5 py-4 text-white font-mono text-xl tracking-[.25em] text-center uppercase outline-none placeholder-[#2a2a38] focus:border-[#4fffb0]/50 focus:ring-2 focus:ring-[#4fffb0]/10 transition-all"
        />
        <button
          onClick={handleAccess}
          disabled={loading || code.trim().length === 0}
          className="sm:w-auto w-full bg-[#4fffb0] text-[#0a0a0f] px-7 py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-[#3aefa0] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Checking
            </span>
          ) : "Get File"}
        </button>
      </div>

      {/* Hints */}
      <div className="flex flex-col gap-1.5 mb-6">
        {[
          "Letters and numbers only — e.g. 4F9K2R",
          "Codes expire after the sender's chosen duration",
          "Codes expire automatically after a short time",
        ].map((hint) => (
          <div key={hint} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#4fffb0]/50 flex-shrink-0" />
            <span className="font-mono text-[11px] text-[#8884a0]">{hint}</span>
          </div>
        ))}
      </div>

      {/* Success — files ready */}
      {result?.files && result.files.length > 0 && (
        <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={15} className="text-[#4fffb0]" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-[#4fffb0]">
                {result.files.length === 1
                  ? "file ready"
                  : `${result.files.length} files ready`}
              </span>
            </div>

            {result.files.length > 1 && (
              <button
                onClick={() => downloadAll(result.files!)}
                className="font-mono text-[11px] text-[#8884a0] hover:text-[#4fffb0] underline underline-offset-2"
              >
                download all
              </button>
            )}
          </div>

          <div className="space-y-3">
            {result.files.map((file, i) => (
              <div
                key={`${file.fileName}-${i}`}
                className="flex items-center gap-3 bg-[#111118] border border-[#2a2a38] rounded-xl px-4 py-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[#7b5ea7]/15 flex items-center justify-center flex-shrink-0">
                  <Download size={14} className="text-[#7b5ea7]" />
                </div>

                <p className="text-white text-sm font-medium truncate flex-1">
  {file.fileName}
</p>

<a
  href={file.downloadUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="bg-[#4fffb0] text-[#0a0a0f] px-3 py-2 rounded-lg text-xs font-bold flex-shrink-0"
>
  Download
</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {result?.error && (
        <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-2xl p-5">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-semibold text-sm mb-0.5">Access failed</p>
            <p className="text-red-400/70 text-xs">{result.error}</p>
          </div>
        </div>
      )}
    </div>
  );
}