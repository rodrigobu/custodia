import { useRef, useState, useCallback } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
const CLOUDINARY_CONFIGURED = CLOUD_NAME.length > 0 && UPLOAD_PRESET.length > 0;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const COMPRESS_QUALITY = 0.7;

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      if (width <= MAX_WIDTH && height <= MAX_HEIGHT && file.size <= 1024 * 1024) {
        resolve(file);
        return;
      }

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas não suportado"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Falha ao comprimir imagem"));
          }
        },
        "image/jpeg",
        COMPRESS_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Falha ao carregar imagem"));
    };

    img.src = url;
  });
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Imagem deve ter no máximo 10MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const compressed = await compressImage(file);

      const formData = new FormData();
      formData.append("file", compressed, file.name.replace(/\.\w+$/, ".jpg"));
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "custodia/veiculos");

      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha no upload");
      }

      const data = await response.json();
      onChange(data.secure_url);
    } catch {
      setError("Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const fakeEvent = {
          target: { files: [file] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        await handleFileChange(fakeEvent);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  if (value) {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
        <img
          src={value}
          alt="Veículo"
          onClick={() => setExpanded(true)}
          className="h-48 w-full cursor-pointer object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex gap-2 pb-3">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
              title="Ampliar"
            >
              Ampliar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-red-600"
              title="Remover"
            >
              Remover
            </button>
          </div>
        </div>

        {/* Lightbox */}
        {expanded && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setExpanded(false)}
          >
            <div
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={value}
                alt="Veículo ampliado"
                className="max-h-[85vh] w-auto"
              />
              <button
                type="button"
                className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                onClick={() => setExpanded(false)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!CLOUDINARY_CONFIGURED) {
    return (
      <div className="flex flex-col gap-2">
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center dark:border-gray-600 dark:bg-gray-800/50">
          <input
            type="url"
            placeholder="Cole a URL da imagem"
            className="mb-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-[#374151] dark:bg-[#111827] dark:text-gray-100 dark:placeholder:text-gray-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const target = e.target as HTMLInputElement;
                if (target.value) onChange(target.value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value) onChange(e.target.value);
            }}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Insira a URL ou configure o Cloudinary para upload direto
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
          dragOver
            ? "border-primary-400 bg-primary-50/50 dark:border-primary-500 dark:bg-primary-900/20"
            : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-gray-500 dark:hover:bg-gray-800"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2 text-center">
          {uploading ? (
            <>
              <svg
                className="h-8 w-8 animate-spin text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Comprimindo e enviando...
              </span>
            </>
          ) : (
            <>
              <svg
                className="h-8 w-8 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Clique ou arraste uma foto
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                JPG, PNG até 10MB
              </span>
            </>
          )}
        </div>
      </label>
      {error && (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
