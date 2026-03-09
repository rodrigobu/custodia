import { useRef, useState, useCallback } from "react";
import "./ImageUpload.css";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

const CLOUD_NAME = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "").trim();
const UPLOAD_PRESET = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "").trim();
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

export function ImageUpload({ value, onChange, max = 3 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = value.filter(Boolean);
  const canAddMore = images.length < max;

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Imagem deve ter no máximo 10MB");
      return;
    }

    if (!canAddMore) {
      setError(`Máximo de ${max} fotos permitido`);
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
      onChange([...images, data.secure_url]);
    } catch {
      setError("Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        await uploadFile(file);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images.length]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const renderUploadButton = () => {
    if (!CLOUDINARY_CONFIGURED) {
      return (
        <div className="upload-area-url">
          <input
            type="url"
            placeholder="Cole a URL da imagem"
            className="url-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const target = e.target as HTMLInputElement;
                if (target.value) {
                  onChange([...images, target.value]);
                  target.value = "";
                }
              }
            }}
            onBlur={(e) => {
              if (e.target.value) {
                onChange([...images, e.target.value]);
                e.target.value = "";
              }
            }}
          />
          <span className="upload-label">
            Insira a URL da imagem ou configure o Cloudinary para upload direto
          </span>
        </div>
      );
    }

    return (
      <label
        className="upload-area upload-area-small"
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
            {uploading ? "Comprimindo e enviando..." : "Adicionar foto"}
          </span>
          <span className="upload-hint">
            {images.length}/{max} fotos
          </span>
        </div>
      </label>
    );
  };

  return (
    <div className="image-upload">
      <div className="image-grid">
        {images.map((url, index) => (
          <div key={index} className="image-preview">
            <img
              src={url}
              alt={`Veículo foto ${index + 1}`}
              onClick={() => setExpandedIndex(index)}
              title="Clique para ampliar"
            />
            <div className="image-preview-actions">
              <button
                type="button"
                className="btn-zoom-image"
                onClick={() => setExpandedIndex(index)}
                title="Ampliar"
              >
                &#x1F50D;
              </button>
              <button
                type="button"
                className="btn-remove-image"
                onClick={() => handleRemove(index)}
                title="Remover"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {canAddMore && renderUploadButton()}
      </div>

      {error && <span className="upload-error">{error}</span>}

      {expandedIndex !== null && (
        <div className="image-overlay" onClick={() => setExpandedIndex(null)}>
          <div className="image-overlay-content" onClick={(e) => e.stopPropagation()}>
            <img src={images[expandedIndex]} alt="Veículo ampliado" />
            <div className="image-overlay-nav">
              {images.length > 1 && (
                <button
                  type="button"
                  className="btn-nav-overlay"
                  disabled={expandedIndex === 0}
                  onClick={() => setExpandedIndex(expandedIndex - 1)}
                >
                  ← Anterior
                </button>
              )}
              <button
                type="button"
                className="btn-close-overlay"
                onClick={() => setExpandedIndex(null)}
              >
                ✕ Fechar
              </button>
              {images.length > 1 && (
                <button
                  type="button"
                  className="btn-nav-overlay"
                  disabled={expandedIndex === images.length - 1}
                  onClick={() => setExpandedIndex(expandedIndex + 1)}
                >
                  Próxima →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
