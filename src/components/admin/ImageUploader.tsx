import { useState, useRef, type DragEvent } from 'react';
import { Upload, X, Image as ImageIcon, Info } from 'lucide-react';
import { uploadImage } from '../../lib/storage';

const MAX_SIZE_MB = 3;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const GUIDE_TEXT = `권장: WebP/JPG, 가로 1920~2560px, ${MAX_SIZE_MB}MB 이하 (히어로는 1MB 내외가 이상적) · squoosh.app에서 변환`;

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
  /** 업로드 용량 한도(MB). 기본 3MB */
  maxSizeMB?: number;
  /** 안내 문구 노출 (기본 true) */
  showGuide?: boolean;
}

export default function ImageUploader({
  value, onChange, folder = 'uploads', label, className = '',
  maxSizeMB = MAX_SIZE_MB, showGuide = true,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }
    const limit = maxSizeMB * 1024 * 1024;
    if (file.size > limit) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      setError(`파일 용량이 너무 큽니다 (${mb}MB). ${maxSizeMB}MB 이하로 줄여주세요. squoosh.app에서 WebP로 변환하면 대부분 1MB 이하로 압축됩니다.`);
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('업로드에 실패했습니다. 네트워크 또는 파일 상태를 확인해주세요.');
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

      {/* 가이드 문구 */}
      {showGuide && (
        <p className="mt-1.5 flex items-start gap-1 text-[11px] text-slate-500 leading-relaxed">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>{maxSizeMB === MAX_SIZE_MB ? GUIDE_TEXT : `권장: WebP/JPG, 가로 1920~2560px, ${maxSizeMB}MB 이하 · squoosh.app에서 변환`}</span>
        </p>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-1.5 text-[11px] text-red-600 leading-relaxed">
          {error}
        </p>
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
