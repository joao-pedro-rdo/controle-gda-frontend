import React, { useState } from 'react';
import { FaPalette, FaSave, FaUndo } from 'react-icons/fa';
import { useColors } from '../../hooks/useColors';

const ColorSchemeManager = () => {
  const { primaryColor, secondaryColor, updateColors, resetColors } = useColors();
  const [tempPrimary, setTempPrimary] = useState(primaryColor);
  const [tempSecondary, setTempSecondary] = useState(secondaryColor);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setTempPrimary(primaryColor);
    setTempSecondary(secondaryColor);
  }, [primaryColor, secondaryColor]);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateColors(tempPrimary, tempSecondary);
    if (result.success) {
      alert(result.fallback ? 'Cores salvas localmente!' : 'Cores atualizadas com sucesso!');
    }
    setIsSaving(false);
  };

  const handleReset = async () => {
    if (window.confirm('Deseja restaurar as cores padrão (vermelho)?')) {
      setIsSaving(true);
      await resetColors();
      setIsSaving(false);
    }
  };

  const presetColors = [
    { name: 'Vermelho', primary: '#dc2626', secondary: '#991b1b' },
    { name: 'Azul', primary: '#2563eb', secondary: '#1e40af' },
    { name: 'Verde', primary: '#16a34a', secondary: '#15803d' },
    { name: 'Roxo', primary: '#9333ea', secondary: '#7e22ce' },
    { name: 'Laranja', primary: '#ea580c', secondary: '#c2410c' },
    { name: 'Rosa', primary: '#ec4899', secondary: '#db2777' },
    { name: 'Indigo', primary: '#4f46e5', secondary: '#4338ca' },
    { name: 'Cinza', primary: '#475569', secondary: '#334155' }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaPalette className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Esquema de Cores</h2>
        </div>
        <button
          onClick={handleReset}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-lg transition-colors"
        >
          <FaUndo className="text-xs" />
          Restaurar Padrão
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Personalize as cores dos botões e elementos do sistema
      </p>

      {/* Seletores de cor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor Principal</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={tempPrimary}
              onChange={(e) => setTempPrimary(e.target.value)}
              className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={tempPrimary}
              onChange={(e) => setTempPrimary(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={tempSecondary}
              onChange={(e) => setTempSecondary(e.target.value)}
              className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={tempSecondary}
              onChange={(e) => setTempSecondary(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Esquemas pré-definidos */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Esquemas Pré-definidos</label>
        <div className="grid grid-cols-4 gap-2">
          {presetColors.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setTempPrimary(preset.primary);
                setTempSecondary(preset.secondary);
              }}
              className="flex flex-col items-center p-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <div className="flex gap-1 mb-1">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.secondary }} />
              </div>
              <span className="text-xs text-gray-600">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mb-4 p-4 border border-gray-300 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">Pré-visualização:</p>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: tempPrimary }}
          >
            Botão Normal
          </button>
          <button
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: tempSecondary }}
          >
            Botão Hover
          </button>
        </div>
      </div>

      {/* Botão Salvar */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
      >
        <FaSave />
        {isSaving ? 'Salvando...' : 'Salvar Cores'}
      </button>
    </div>
  );
};

export default ColorSchemeManager;
