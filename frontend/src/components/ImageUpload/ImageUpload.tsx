import { useRef, useState } from "react";
import "./ImageUpload.css";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
const CLOUDINARY_CONFIGURED = CLOUD_NAME.length > 0 && UPLOAD_PRESET.length > 0;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem deve ter no máximo 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "custodia/veiculos");

    try {
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

  if (!CLOUDINARY_CONFIGURED) {
    return (
      <div className="image-upload">
        {value ? (
          <div className="image-preview">
            <img src={value} alt="Veículo" />
            <button type="button" className="btn-remove-image" onClick={handleRemove}>
              Remover
            </button>
          </div>
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
            <span className="upload-label">Insira a URL da imagem ou configure o Cloudinary para upload direto</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="image-upload">
      {value ? (
        <div className="image-preview">
          <img src={value} alt="Veículo" />
          <button type="button" className="btn-remove-image" onClick={handleRemove}>
            Remover
          </button>
        </div>
      ) : (
        <label className="upload-area">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <span className="upload-label">
            {uploading ? "Enviando..." : "Clique para adicionar foto"}
          </span>
        </label>
      )}
      {error && <span className="upload-error">{error}</span>}
    </div>
  );
}
