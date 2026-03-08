import React, { useCallback, useState } from 'react';
import { UploadCloud, Camera } from 'lucide-react';
import { processImageFile } from '../utils/imageProcess';

interface ImageUploadProps {
  onUpload: (base64: string, mimeType: string, fileUrl: string) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0], onUpload);
    }
  }, [onUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0], onUpload);
    }
  };

  return (
    <div
      className={`w-full mx-auto p-12 lg:p-16 border-2 border-dashed rounded-[2rem] transition-colors duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer ${isDragging ? 'border-accent bg-accent/5' : 'border-dark/20 bg-paper hover:bg-background'
        }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <div className="bg-dark text-paper p-4 rounded-full shadow-sm mb-6 pointer-events-none">
        <UploadCloud className="w-8 h-8 text-accent pointer-events-none" />
      </div>
      <h3 className="text-xl font-heading font-black text-dark tracking-tight uppercase mb-3 pointer-events-none">Drag & Drop Photo Here</h3>
      <p className="font-data text-dark/50 text-center max-w-sm mb-8 leading-relaxed text-sm pointer-events-none">
        Supported formats: JPEG, PNG, HEIC. Max file size:<br />
        25MB. AI will analyze the image for compliance.
      </p>

      <button
        className="bg-accent hover:bg-dark text-paper font-heading font-bold text-sm tracking-wide py-4 px-8 rounded-full shadow-sm transition-colors flex items-center justify-center gap-2 uppercase"
        onClick={(e) => {
          e.stopPropagation();
          document.getElementById('file-upload')?.click();
        }}
      >
        <Camera className="w-5 h-5" />
        Snap / Upload Photo
      </button>
    </div>
  );
}
