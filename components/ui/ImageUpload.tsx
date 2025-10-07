'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '@/lib/api';

interface ImageUploadProps {
  currentImage?: string;
  onUploadSuccess: (imageUrl: string) => void;
  type: 'logo' | 'avatar';
  label?: string;
}

export default function ImageUpload({ 
  currentImage, 
  onUploadSuccess, 
  type,
  label = 'Upload de Imagem'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validação de tamanho
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB.');
      return;
    }

    // Preview local
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append(type === 'logo' ? 'logo' : 'avatar', file);

      const endpoint = type === 'logo' 
        ? '/upload/barbershop-logo' 
        : '/upload/user-avatar';

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = response.data.logoUrl || response.data.avatarUrl;
      onUploadSuccess(imageUrl);
      setPreview(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${imageUrl}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer upload');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Preview */}
      {preview && (
        <div className="flex justify-center mb-4">
          <img 
            src={preview} 
            alt="Preview" 
            className={`object-cover border-2 border-gray-300 ${
              type === 'avatar' ? 'w-32 h-32 rounded-full' : 'w-48 h-48 rounded-lg'
            }`}
          />
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-sm text-gray-600">Enviando...</p>
          </div>
        ) : isDragActive ? (
          <p className="text-purple-600 font-medium">Solte a imagem aqui...</p>
        ) : (
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-purple-600 hover:text-purple-500">
                Clique para selecionar
              </span>
              {' '}ou arraste a imagem
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF até 5MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}