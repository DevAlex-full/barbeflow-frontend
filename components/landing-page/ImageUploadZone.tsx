'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  currentImage?: string;
  label: string;
  description?: string;
  maxSize?: number; // MB
  aspectRatio?: string;
  minWidth?: number;
  minHeight?: number;
}

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      resolve({ width: image.width, height: image.height });
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      reject(new Error('Não foi possível ler a imagem enviada.'));
      URL.revokeObjectURL(objectUrl);
    };

    image.src = objectUrl;
  });
}

export function ImageUploadZone({
  onUpload,
  currentImage,
  label,
  description,
  maxSize = 5,
  aspectRatio,
  minWidth,
  minHeight,
}: ImageUploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const validateFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Formato inválido. Envie JPG, PNG, WEBP ou GIF.');
      }

      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`Arquivo muito grande. Máximo permitido: ${maxSize}MB.`);
      }

      if (minWidth || minHeight) {
        const dimensions = await getImageDimensions(file);

        if ((minWidth && dimensions.width < minWidth) || (minHeight && dimensions.height < minHeight)) {
          throw new Error(
            `Imagem muito pequena. Mínimo recomendado: ${minWidth || 0}x${minHeight || 0}px.`
          );
        }
      }
    },
    [maxSize, minWidth, minHeight]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError('');

      try {
        await validateFile(file);

        const previewUrl = URL.createObjectURL(file);
        setPreview((prev) => {
          if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
          return previewUrl;
        });

        setUploading(true);
        await onUpload(file);

        setPreview((prev) => {
          if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
          return null;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao processar upload.';
        setError(message);
        setPreview((prev) => {
          if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
          return null;
        });
      } finally {
        setUploading(false);
      }
    },
    [onUpload, validateFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const displayImage = preview || currentImage;

  const containerClass = useMemo(() => {
    if (aspectRatio === 'square') return displayImage ? 'aspect-square' : 'aspect-square';
    return displayImage ? 'aspect-video' : 'aspect-video md:aspect-auto md:h-48';
  }, [aspectRatio, displayImage]);

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
          ${containerClass}
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
              <div className="text-white text-center px-4">
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
              PNG, JPG, WEBP e GIF até {maxSize}MB
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

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}