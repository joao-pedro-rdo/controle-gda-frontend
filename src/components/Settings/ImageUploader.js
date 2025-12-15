import React, { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaImage, FaCheckCircle, FaSpinner, FaTrash } from 'react-icons/fa';
import client from '../../services/client';

const API_BASE_URL = 'http://localhost:5000';

const ImageUploader = ({ 
  title, 
  description, 
  currentImage, 
  imageType,
  onImageUpdate,
  onReset
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tamanho do arquivo (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB');
        return;
      }

      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Por favor, selecione uma imagem válida (JPEG, PNG, GIF ou WEBP)');
        return;
      }

      setSelectedFile(file);

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const endpoint = imageType === 'logo' 
        ? '/system-images/upload/logo' 
        : '/system-images/upload/background';

      const response = await client.post(endpoint, formData);
      
      const data = response.data;
      
      // Notificar componente pai
      onImageUpdate(data.path || data.imagePath);
      
      // Limpar seleção
      setSelectedFile(null);
      setPreview(null);
      fileInputRef.current.value = '';
      
      alert('Imagem atualizada com sucesso!');

    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      
      const errorMessage = error.response?.data?.message || error.message;
      
      if (error.response?.status === 403) {
        alert('Você não tem permissão para alterar as imagens do sistema (necessário perfil S2)');
      } else {
        alert(`Erro: ${errorMessage}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm(`Deseja restaurar a ${title.toLowerCase()} padrão?`)) {
      return;
    }

    setResetting(true);

    try {
      await client.delete(`/system-images/${imageType}`);

      // Notificar componente pai
      if (onReset) {
        onReset(imageType);
      }
      
      alert('Imagem restaurada com sucesso!');

    } catch (error) {
      console.error('Erro ao restaurar imagem:', error);
      
      const errorMessage = error.response?.data?.message || error.message;
      
      if (error.response?.status === 403) {
        alert('Você não tem permissão para alterar as imagens do sistema (necessário perfil S2)');
      } else {
        alert(`Erro: ${errorMessage}`);
      }
    } finally {
      setResetting(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <button
          onClick={handleReset}
          disabled={resetting}
          className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
          title="Restaurar imagem padrão"
        >
          {resetting ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <>
              <FaTrash className="mr-2" />
              Restaurar
            </>
          )}
        </button>
      </div>

      {/* Preview da Imagem Atual */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
          <img
            src={preview || currentImage}
            alt="Preview"
            className="h-20 w-20 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESem imagem%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {preview ? 'Nova imagem selecionada' : 'Imagem atual'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {preview ? 'Clique em "Aplicar" para salvar' : 'Clique abaixo para alterar'}
          </p>
        </div>
      </div>

      {/* Área de Upload */}
      <div
        onClick={handleClick}
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
        />
        
        <div className="text-center">
          {selectedFile ? (
            <div className="space-y-3">
              <FaImage className="mx-auto h-12 w-12 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Clique para selecionar</p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, GIF, WEBP até 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ações */}
      {selectedFile && (
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <FaCheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-700">Arquivo selecionado</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Aplicando...
                </>
              ) : (
                'Aplicar'
              )}
            </button>
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;