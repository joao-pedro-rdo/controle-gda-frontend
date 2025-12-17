import React, { useState } from 'react';
import { FaPlus, FaTrash, FaUndo, FaMapMarkerAlt } from 'react-icons/fa';
import { useDestinations } from '../../hooks/useDestinations';

const DestinationManager = () => {
  const { destinations, loading, addDestination, removeDestination, resetToDefaults } = useDestinations();
  const [newDestination, setNewDestination] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newDestination.trim()) return;

    setIsAdding(true);
    const result = await addDestination(newDestination.trim());
    
    if (result.success) {
      setNewDestination('');
    } else {
      alert('Erro ao adicionar destino: ' + result.error);
    }
    setIsAdding(false);
  };

  const handleRemove = async (destination) => {
    if (window.confirm(`Deseja realmente remover o destino "${destination}"?`)) {
      const result = await removeDestination(destination);
      if (!result.success) {
        alert('Erro ao remover destino: ' + result.error);
      }
    }
  };

  const handleReset = async () => {
    if (window.confirm('Deseja restaurar os destinos padrão? Esta ação irá remover todos os destinos personalizados.')) {
      const result = await resetToDefaults();
      if (!result.success) {
        alert('Erro ao restaurar destinos: ' + result.error);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaMapMarkerAlt className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Seções de Destino
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          title="Restaurar destinos padrão"
        >
          <FaUndo className="text-xs" />
          Restaurar Padrão
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Gerencie as seções de destino disponíveis para visitantes
      </p>

      {/* Input para adicionar novo destino */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newDestination}
          onChange={(e) => setNewDestination(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Adicionar nova seção..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={50}
          disabled={isAdding}
        />
        <button
          onClick={handleAdd}
          disabled={!newDestination.trim() || isAdding}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          <FaPlus />
          {isAdding ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>

      {/* Lista de destinos */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {destinations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaMapMarkerAlt className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>Nenhuma seção de destino cadastrada</p>
          </div>
        ) : (
          destinations.map((destination, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <span className="font-medium text-gray-700">{destination}</span>
              <button
                onClick={() => handleRemove(destination)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remover destino"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Dica:</strong> Estas seções aparecerão nos formulários de registro e agendamento de visitantes.
        </p>
      </div>
    </div>
  );
};

export default DestinationManager;
