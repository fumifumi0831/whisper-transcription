import { Upload, FileAudio } from 'lucide-react';
import { useCallback } from 'react';

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled: boolean;
}

export function FileUploadArea({ onFileSelect, selectedFile, disabled }: FileUploadAreaProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('audio/')) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        disabled 
          ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
          : 'border-gray-400 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
      }`}
    >
      {selectedFile ? (
        <div className="flex flex-col items-center gap-4">
          <FileAudio className="w-16 h-16 text-blue-600" />
          <div>
            <p className="text-gray-900">{selectedFile.name}</p>
            <p className="text-gray-500 text-sm">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          {!disabled && (
            <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
              ファイルを変更
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={disabled}
              />
            </label>
          )}
        </div>
      ) : (
        <label className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-16 h-16 text-gray-400" />
            <div>
              <p className="text-gray-700">
                音声ファイルをドラッグ&ドロップ
              </p>
              <p className="text-gray-500 text-sm mt-2">
                または クリックしてファイルを選択
              </p>
            </div>
          </div>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );
}
