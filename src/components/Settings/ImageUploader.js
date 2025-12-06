import React, { useRef } from 'react';
import { FaCloudUploadAlt, FaImage, FaCheckCircle } from 'react-icons/fa';

const ImageUploader = ({ 
  title, 
  description, 
  currentImage, 
  onFileChange, 
  selectedFile, 
  accept, 
  maxSize 
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tamanho do arquivo
      if (file.size > maxSize * 1024 * 1024) {
        alert(`O arquivo deve ter no máximo ${maxSize}MB`);
        return;
      }
      onFileChange(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Preview da Imagem Atual */}
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            src={currentImage}
            alt="Preview atual"
            className="h-16 w-16 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.src = '/img/placeholder.png';
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Imagem atual</p>
          <p className="text-sm text-gray-500">Clique abaixo para alterar</p>
        </div>
      </div>

      {/* Área de Upload */}
      <div
        onClick={handleClick}
        className="relative border-2 border-gray-300 border-dashed rounded-lg p-6 hover:border-gray-400 cursor-pointer transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        
        <div className="text-center">
          {selectedFile ? (
            <div className="space-y-2">
              <FaImage className="mx-auto h-12 w-12 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Clique para fazer upload</p>
                <p className="text-sm text-gray-500">ou arraste e solte aqui</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
          <div className="flex items-center">
            <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-green-700">Arquivo selecionado</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileChange(null);
              fileInputRef.current.value = '';
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remover
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;