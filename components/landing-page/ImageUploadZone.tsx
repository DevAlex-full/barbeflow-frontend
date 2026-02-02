'use client';

import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  currentImage?: string;
  label: string;
  description?: string;
  maxSize?: number; // em MB
  aspectRatio?: string;
}

export function ImageUploadZone({
  onUpload,
  currentImage,
  label,
  description,
  maxSize = 5,
  aspectRatio
}: ImageUploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validação de tamanho
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Arquivo muito grande. Máximo ${maxSize}MB`);
      return;
    }

    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie apenas imagens');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      await onUpload(file);
      setPreview(null);
    } catch (error) {
      console.error('Erro no upload:', error);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [onUpload, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const displayImage = preview || currentImage;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer
          transition-all duration-200
          ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${displayImage ? 'aspect-video' : 'aspect-video md:aspect-auto md:h-48'}
        `}
      >
        <input {...getInputProps()} />

        {displayImage ? (
          <div className="relative w-full h-full">
            <img
              src={displayImage}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white text-center">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Clique ou arraste para trocar</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {isDragActive ? 'Solte a imagem aqui' : 'Arraste uma imagem ou clique para selecionar'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP até {maxSize}MB
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
              <p className="text-sm font-medium text-gray-700 mt-2">Enviando...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}