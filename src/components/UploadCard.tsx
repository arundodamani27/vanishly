"use client";

import { supabase } from "@/lib/supabase/client";
import { nanoid } from "nanoid";
import { QRCodeCanvas } from "qrcode.react";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  Copy,
  Link2,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function UploadCard() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [isAccessed, setIsAccessed] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [expired, setExpired] = useState(false);

  async function uploadFile(file: File) {
  if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
    setMessage("Video and audio files are not supported");
    setMessageType("error");
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    setMessage("File exceeds 50MB limit");
    setMessageType("error");
    return;
  }

  setSelectedFile(file);
  setLoading(true);
  setProgress(0);
  setMessage("");
  setAccessCode("");
  setIsAccessed(false);
  setExpired(false);

  try {
    // Generate access code
    const accessCode = nanoid(6).toUpperCase();

    // Keep original filename
    const filePath = `${accessCode}/${file.name}`;

    // Upload directly to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("temp-files")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    setProgress(95);

    // Save metadata in database
    const response = await fetch("/api/create-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessCode,
        fileName: file.name,
        filePath,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to create upload");
    }

    setProgress(100);
    setAccessCode(data.accessCode);
    setMessage("File uploaded successfully");
    setMessageType("success");

  } catch (err: unknown) {
  if (err instanceof Error) {
    setMessage(err.message);
  } else {
    setMessage("Upload failed");
  }
  setMessageType("error");
} finally {
    setLoading(false);
  }
}

  async function checkStatus() {
    if (!accessCode || isAccessed || expired) return;

    try {
      setCheckingStatus(true);

      const res = await fetch("/api/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessCode,
        }),
      });

      const data = await res.json();

      if (data.expired) {
        setExpired(true);
        setMessage("File expired and was automatically deleted");
        setMessageType("error");
        return;
      }

      if (data.isAccessed) {
        setIsAccessed(true);
      }
    } catch {
      console.error("Status check failed");
    } finally {
      setCheckingStatus(false);
    }
  }

  async function deleteFile() {
    if (!accessCode) return;

    try {
      setDeleting(true);

      const res = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("File deleted successfully");
        setMessageType("success");
        setAccessCode("");
        setSelectedFile(null);
        setIsAccessed(false);
        setExpired(false);
      } else {
        setMessage(data.error || "Delete failed");
        setMessageType("error");
      }
    } catch {
      setMessage("Delete failed");
      setMessageType("error");
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (!accessCode || isAccessed || expired) return;

    const interval = setInterval(() => {
      checkStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [accessCode, isAccessed, expired]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        uploadFile(acceptedFiles[0]);
      }
    },
  });

  function copyToClipboard(text: string, type: "code" | "link") {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="bg-[#111118] rounded-3xl p-6 sm:p-10 border border-[#2a2a38] shadow-2xl max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#4fffb0]/10 flex items-center justify-center mx-auto mb-4">
          <UploadCloud size={28} strokeWidth={1.5} className="text-[#4fffb0]" />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white mb-2">
          Upload <span className="text-[#4fffb0]">file</span>
        </h1>

        <p className="text-[#8884a0] text-sm">
          Transfer files instantly between devices — no account needed.
        </p>
      </div>

      {!accessCode && (
        <>
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200
              ${
                isDragActive
                  ? "border-[#4fffb0] bg-[#4fffb0]/5"
                  : "border-[#2a2a38] hover:border-[#4fffb0]/50 hover:bg-[#4fffb0]/3"
              }`}
          >
            <input {...getInputProps()} />

            {loading ? (
              <div>
                <p className="font-mono text-sm text-[#4fffb0] mb-4">
                  uploading... {progress}%
                </p>

                <div className="w-full bg-[#2a2a38] rounded-full h-1.5">
                  <div
                    className="bg-[#4fffb0] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {selectedFile && (
                  <p className="font-mono text-[11px] text-[#8884a0] mt-3 truncate">
                    {selectedFile.name}
                  </p>
                )}
              </div>
            ) : isDragActive ? (
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#4fffb0]/20 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud size={24} className="text-[#4fffb0]" />
                </div>
                <p className="text-[#4fffb0] font-semibold">Drop it here</p>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2a2a38] flex items-center justify-center mx-auto mb-3">
                  <UploadCloud size={22} className="text-[#8884a0]" />
                </div>

                <p className="text-white font-semibold mb-1">
                  Drag & drop your file here
                </p>

                <p className="text-[#8884a0] text-sm">
                  or <span className="text-[#4fffb0]">click to browse</span>
                </p>
              </div>
            )}
          </div>

          <p className="font-mono text-[10px] text-[#8884a0] text-center mt-3 tracking-wide">
            all file types supported except video & audio · max 50 MB
          </p>


        </>
      )}


      {checkingStatus && (
  <p className="text-xs text-gray-400">
    Checking status...
  </p>
)}

      {selectedFile && !loading && !accessCode && (
        <div className="mt-4 flex items-center gap-3 bg-[#16161f] border border-[#2a2a38] rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-[#7b5ea7]/15 flex items-center justify-center">
            <FileText size={15} className="text-[#7b5ea7]" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {selectedFile.name}
            </p>
            <p className="font-mono text-[11px] text-[#8884a0]">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        </div>
      )}

      {message && !accessCode && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 border text-sm
            ${
              messageType === "error"
                ? "bg-red-500/8 border-red-500/20 text-red-400"
                : "bg-[#4fffb0]/8 border-[#4fffb0]/20 text-[#4fffb0]"
            }`}
        >
          {messageType === "error" ? (
            <AlertCircle size={15} />
          ) : (
            <CheckCircle size={15} />
          )}
          {message}
        </div>
      )}

      {accessCode && (
        <>
          <div className="mt-6 bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-6 text-center">
            {!isAccessed && !expired && (
              <div className="mb-4 flex items-center justify-center gap-2 text-[#8884a0] text-xs font-mono uppercase tracking-widest">
                <Loader2 size={14} className="animate-spin" />
                Waiting for recipient...
              </div>
            )}

            {isAccessed && (
              <div className="mb-4 text-[#4fffb0] text-sm font-semibold">
                Recipient accessed successfully ✅
              </div>
            )}

            <div className="font-mono text-5xl font-medium tracking-[.3em] text-[#4fffb0] mb-2">
              {accessCode}
            </div>

            <p className="text-[#8884a0] text-xs mb-5">
              share this code with your other device
            </p>

            <div className="flex justify-center gap-2 flex-wrap">
              <button
                onClick={() => copyToClipboard(accessCode, "code")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2a2a38] text-xs font-mono text-[#8884a0] hover:text-[#4fffb0]"
              >
                <Copy size={13} />
                {copied === "code" ? "copied!" : "copy code"}
              </button>

              <button
                onClick={() =>
                  copyToClipboard(
                    `${window.location.origin}/receive?code=${accessCode}`,
                    "link"
                  )
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2a2a38] text-xs font-mono text-[#8884a0] hover:text-[#4fffb0]"
              >
                <Link2 size={13} />
                {copied === "link" ? "copied!" : "share link"}
              </button>

              {isAccessed && (
                <button
                  onClick={deleteFile}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-xs font-mono text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={13} />
                  {deleting ? "deleting..." : "delete file"}
                </button>
              )}
            </div>
          </div>

          {!isAccessed && !expired && (
            <div className="mt-5 text-center">
              <p className="font-mono text-[10px] tracking-widest uppercase text-[#8884a0] mb-4">
                or scan on mobile
              </p>

              <div className="inline-block bg-white p-3 rounded-2xl">
                <QRCodeCanvas
                  value={`${window.location.origin}/receive?code=${accessCode}`}
                  size={160}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}