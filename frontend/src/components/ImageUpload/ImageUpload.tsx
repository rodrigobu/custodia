import { useRef, useState, useCallback } from "react";
import "./ImageUpload.css";

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
  }, []);

  const renderPreview = () => (
    <>
      <div className="image-preview">
        <img
          src={value}
          alt="Veículo"
          onClick={() => setExpanded(true)}
          title="Clique para ampliar"
        />
        <div className="image-preview-actions">
          <button
            type="button"
            className="btn-zoom-image"
            onClick={() => setExpanded(true)}
            title="Ampliar"
          >
            &#x1F50D;
          </button>
          <button
            type="button"
            className="btn-remove-image"
            onClick={handleRemove}
            title="Remover"
          >
            ✕
          </button>
        </div>
      </div>

      {expanded && (
        <div className="image-overlay" onClick={() => setExpanded(false)}>
          <div className="image-overlay-content" onClick={(e) => e.stopPropagation()}>
            <img src={value} alt="Veículo ampliado" />
            <button
              type="button"
              className="btn-close-overlay"
              onClick={() => setExpanded(false)}
            >
              ✕ Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (!CLOUDINARY_CONFIGURED) {
    return (
      <div className="image-upload">
        {value ? (
          renderPreview()
        ) : (
          <div className="upload-area-url">
            <input
              type="url"
              placeholder="Cole a URL da imagem"
              className="url-input"
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
            <span className="upload-label">
              Insira a URL da imagem ou configure o Cloudinary para upload direto
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="image-upload">
      {value ? (
        renderPreview()
      ) : (
        <label
          className="upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <div className="upload-area-content">
            <span className="upload-icon">📷</span>
            <span className="upload-label">
              {uploading ? "Comprimindo e enviando..." : "Clique ou arraste uma foto"}
            </span>
            <span className="upload-hint">JPG, PNG até 10MB — será comprimida automaticamente</span>
          </div>
        </label>
      )}
      {error && <span className="upload-error">{error}</span>}
    </div>
  );
}
