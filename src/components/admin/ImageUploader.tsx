import { useState, useRef, type DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../../lib/storage';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUploader({ value, onChange, folder = 'uploads', label, className = '' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
          <img src={value} alt="" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-900 text-xs font-medium rounded-md"
            >
              변경
            </button>
            <button
              onClick={() => onChange('')}
              className="p-1.5 bg-white/90 text-red-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-xs text-slate-500">업로드 중...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {dragOver ? <Upload className="w-6 h-6 text-blue-500" /> : <ImageIcon className="w-6 h-6 text-slate-400" />}
              <span className="text-xs text-slate-500">클릭 또는 드래그하여 이미지 업로드</span>
            </div>
          )}
        </div>
      )}

      {/* URL 직접 입력 */}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="또는 이미지 URL 직접 입력"
        className="mt-2 w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
