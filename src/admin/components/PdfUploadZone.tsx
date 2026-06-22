import { useState, useRef } from "react";
import { UploadCloud, X, FileText, Loader2 } from "lucide-react";
import { API_URL } from "../../config/api";

interface PdfUploadZoneProps {
  label: string;
  description: string;
  value: string;
  onChange: (url: string) => void;
}

export function PdfUploadZone({ label, description, value, onChange }: PdfUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
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
      const url = await uploadToCloudinary(files[0]);
      onChange(url);
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("Failed to upload PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      {value && typeof value === 'string' ? (
        <div className="relative border border-slate-200 rounded-lg p-4 bg-red-50 flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-red-600 shadow-sm">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">PDF Uploaded Successfully</p>
              <a href={value} target="_blank" rel="noreferrer" className="text-xs text-red-600 hover:underline">View File</a>
            </div>
          </div>
          <button type="button" onClick={() => onChange("")} className="bg-white text-slate-500 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer min-h-[150px] ${
            isDragging ? "border-red-500 bg-red-50" : "border-slate-300 hover:bg-slate-50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="application/pdf"
            onChange={(e) => handleFiles(e.target.files)} 
          />
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-[#C8181E] rounded-full animate-spin mb-2"></div>
              <span className="text-sm font-medium text-slate-700">Uploading PDF to Cloudinary...</span>
            </div>
          ) : (
            <>
              <UploadCloud className="text-slate-400 mb-2" size={32} />
              <span className="text-sm font-medium text-slate-700">{isDragging ? "Drop PDF here" : description}</span>
              <span className="text-xs text-slate-500 mt-1">PDF up to 50MB</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
