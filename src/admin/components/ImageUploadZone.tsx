import { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { API_URL } from "../../config/api";

interface ImageUploadZoneProps {
  label: string;
  description: string;
  multiple?: boolean;
  value: string | string[];
  onChange: (url: string | string[]) => void;
  aspectRatio?: string;
}

export function ImageUploadZone({ label, description, multiple = false, value, onChange, aspectRatio = "2/3" }: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Real Cloudinary upload function via backend API
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Upload failed");
    }
    
    const data = await response.json();
    return data.url;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      if (multiple) {
        const newUrls = await Promise.all(Array.from(files).map(uploadToCloudinary));
        const currentUrls = Array.isArray(value) ? value : [];
        onChange([...currentUrls, ...newUrls]);
      } else {
        const url = await uploadToCloudinary(files[0]);
        onChange(url);
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      {!multiple && value && typeof value === 'string' ? (
        <div className="relative border border-slate-200 rounded-lg overflow-hidden group" style={{ aspectRatio }}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={() => onChange("")} className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50">
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
            isDragging ? "border-red-500 bg-red-50" : "border-slate-300 hover:bg-slate-50"
          } ${multiple ? "min-h-[200px]" : ""}`}
          style={!multiple ? { aspectRatio } : undefined}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple={multiple} 
            accept="image/jpeg,image/png"
            onChange={(e) => handleFiles(e.target.files)} 
          />
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-[#C8181E] rounded-full animate-spin mb-2"></div>
              <span className="text-sm font-medium text-slate-700">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <>
              <UploadCloud className="text-slate-400 mb-2" size={32} />
              <span className="text-sm font-medium text-slate-700">{isDragging ? "Drop images here" : description}</span>
              <span className="text-xs text-slate-500 mt-1">JPEG/PNG up to 5MB</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
