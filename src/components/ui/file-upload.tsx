'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onFileChange,
  accept = '*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const selectedFile = acceptedFiles[0];

      if (selectedFile.size > maxSize) {
        setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
        return;
      }

      setFile(selectedFile);
      onFileChange(selectedFile);
    },
    [maxSize, onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    onFileChange(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400',
          error && 'border-red-500'
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                Drag and drop a file here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                {accept !== '*' && `Accepted formats: ${accept}`}
              </p>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
} 