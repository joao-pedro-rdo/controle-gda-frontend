import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose, MdImage, MdDownload } from "react-icons/md";
import QRCode from "qrcode";
import client from "../../services/client";

// Fix para tipagem de ícones do react-icons
const CloseIcon = MdClose as any;
const ImageIcon = MdImage as any;
const DownloadIcon = MdDownload as any;

interface PermissionarioFormProps {
  toEdit: any;
  setToEdit: (value: any) => void;
  reload: boolean;
  setReload: (value: boolean) => void;
}

const PermissionarioForm: React.FC<PermissionarioFormProps> = ({
  toEdit,
  setToEdit,
  reload,
  setReload,
}) => {
  const navigate = useNavigate();
  const [imageBase64, setImageBase64] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ show: false, message: "", type: "success" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast helper
  const toast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setShowToast({ show: true, message, type });
    setTimeout(() => {
      setShowToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Carregar dados do permissionário para edição
  useEffect(() => {
    if (toEdit) {
      const form = document.getElementById(
        "permissionarioForm"
      ) as HTMLFormElement;
      if (form) {
        (form.elements.namedItem("completeName") as HTMLInputElement).value =
          toEdit.completeName || "";
        (form.elements.namedItem("idNumber") as HTMLInputElement).value =
          toEdit.idNumber || "";
        (form.elements.namedItem("CPF") as HTMLInputElement).value =
          toEdit.CPF || "";
        (form.elements.namedItem("local") as HTMLInputElement).value =
          toEdit.local || "";
        (form.elements.namedItem("carModel") as HTMLInputElement).value =
          toEdit.carModel || "";
        (form.elements.namedItem("licensePlate") as HTMLInputElement).value =
          toEdit.licensePlate || "";
        (form.elements.namedItem("color") as HTMLInputElement).value =
          toEdit.color || "";
      }

      if (toEdit.imagePath) {
        setCurrentImage(toEdit.imagePath);
      }

      if (toEdit.CPF) {
        generateQRCode(toEdit.CPF);
      }
    } else {
      const form = document.getElementById(
        "permissionarioForm"
      ) as HTMLFormElement;
      if (form) {
        form.reset();
      }
      setCurrentImage(null);
      setImageBase64("");
      setSelectedFile(null);
      setPreviewImage(null);
      setImgUrl(null);
    }
  }, [toEdit]);

  const generateQRCode = async (cpf: string) => {
    try {
      const stringify = `{"permissionario": ${JSON.stringify(cpf)}}`;
      const response = await QRCode.toDataURL(stringify);
      setImgUrl(response);
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast("Por favor, selecione apenas arquivos de imagem", "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast("A imagem deve ter no máximo 5MB", "error");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setImageBase64("");
      setCurrentImage(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const submitData = new FormData();

    submitData.append("completeName", formData.get("completeName") as string);
    submitData.append("idNumber", formData.get("idNumber") as string);
    submitData.append(
      "CPF",
      (formData.get("CPF") as string).replace(/\D/g, "")
    );
    submitData.append("local", formData.get("local") as string);
    submitData.append("carModel", (formData.get("carModel") as string) || "");
    submitData.append(
      "licensePlate",
      (formData.get("licensePlate") as string) || ""
    );
    submitData.append("color", (formData.get("color") as string) || "");

    if (selectedFile) {
      submitData.append("image", selectedFile);
      console.log("🖼️ Arquivo selecionado adicionado ao FormData");
    } else if (imageBase64) {
      const base64Data = imageBase64.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      submitData.append("image", blob, "permissionario.jpg");
      console.log("🖼️ Imagem capturada adicionada ao FormData");
    } else if (toEdit && currentImage && !previewImage) {
      submitData.append("keepExistingImage", "true");
    } else if (toEdit && !currentImage) {
      submitData.append("removeImage", "true");
    }

    console.log("📤 Enviando permissionário multipart...");

    try {
      if (toEdit?.id) {
        const response = await client.patch(
          `/permissionarios/${toEdit.id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast("Permissionário atualizado", "success");
        generateQRCode((formData.get("CPF") as string).replace(/\D/g, ""));
        setToEdit(response.data);
      } else {
        const response = await client.post("/permissionarios", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast("Permissionário cadastrado", "success");
        generateQRCode((formData.get("CPF") as string).replace(/\D/g, ""));
        setToEdit(response.data);
      }

      setReload(!reload);
      console.log("✅ Permissionário salvo com sucesso");
    } catch (error: any) {
      console.error("❌ Erro ao salvar permissionário:", error);

      let errorMessage = "Erro ao salvar permissionário";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const removeCurrentImage = () => {
    setCurrentImage(null);
    setImageBase64("");
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadQRCode = () => {
    if (!imgUrl || !toEdit?.completeName || !toEdit?.CPF) {
      toast("QR Code não disponível", "error");
      return;
    }

    const link = document.createElement("a");
    link.href = imgUrl;
    const fileName = `${toEdit.completeName}_${toEdit.CPF}.png`;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast("QR Code baixado", "success");
  };

  const formatCPF = (value: string) => {
    let cpf = value.replace(/\D/g, "");
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})/, "$1-$2");
      return cpf;
    }
    return value;
  };

  const formatLicensePlate = (value: string) => {
    let plate = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (plate.length <= 7) {
      if (plate.length === 7 && /^[A-Z]{3}[0-9]{4}$/.test(plate)) {
        plate = plate.replace(/([A-Z]{3})([0-9]{4})/, "$1-$2");
      }
      return plate;
    }
    return value;
  };

  return (
    <div className="border border-gray-300 flex justify-center w-[90%] mx-auto mt-8 p-4 rounded-2xl bg-white shadow-lg">
      {/* Toast Notification */}
      {showToast.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            showToast.type === "success"
              ? "bg-green-500 text-white"
              : showToast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {showToast.message}
        </div>
      )}

      <div className="w-full p-4 max-w-4xl mx-auto">
        <form id="permissionarioForm" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {toEdit ? "Editar Permissionário" : "Cadastrar Permissionário"}
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-blue-800">
                Cadastre um permissionário para acesso autorizado ao local com
                QR Code personalizado.
              </p>
            </div>

            {/* Dados Pessoais */}
            <div className="bg-blue-100 text-blue-900 font-semibold px-4 py-2 rounded-md">
              Dados Pessoais
            </div>

            <div>
              <label
                htmlFor="completeName"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                id="completeName"
                name="completeName"
                type="text"
                required
                placeholder="Nome completo do permissionário"
                pattern="[A-Za-zÀ-ÿ\s]{3,}"
                title="Nome deve ter pelo menos 3 caracteres"
                minLength={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 capitalize"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="idNumber"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Identidade <span className="text-red-500">*</span>
                </label>
                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  required
                  placeholder="Número da identidade"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="CPF"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  CPF <span className="text-red-500">*</span>
                </label>
                <input
                  id="CPF"
                  name="CPF"
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  pattern="[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}"
                  title="Digite um CPF válido (000.000.000-00)"
                  maxLength={14}
                  onInput={(e) => {
                    e.currentTarget.value = formatCPF(e.currentTarget.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="local"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Local de Trabalho <span className="text-red-500">*</span>
              </label>
              <input
                id="local"
                name="local"
                type="text"
                required
                placeholder="Setor, departamento ou local de trabalho"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Dados do Veículo */}
            <div className="bg-green-100 text-green-900 font-semibold px-4 py-2 rounded-md">
              Dados do Veículo (Opcional)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="carModel"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Modelo do Veículo
                </label>
                <input
                  id="carModel"
                  name="carModel"
                  type="text"
                  placeholder="Ex: Honda Civic"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label
                  htmlFor="licensePlate"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Placa
                </label>
                <input
                  id="licensePlate"
                  name="licensePlate"
                  type="text"
                  placeholder="ABC-1234 ou ABC1D23"
                  pattern="[A-Z]{3}-?[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2}"
                  title="Digite uma placa brasileira válida"
                  maxLength={8}
                  onInput={(e) => {
                    e.currentTarget.value = formatLicensePlate(
                      e.currentTarget.value
                    );
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 uppercase"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="color"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Cor do Veículo
              </label>
              <input
                id="color"
                name="color"
                type="text"
                placeholder="Ex: Branco, Prata, Azul"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Seção de Imagem */}
            <div className="bg-purple-100 text-purple-900 font-semibold px-4 py-2 rounded-md">
              Foto do Permissionário
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                disabled={loading}
              />

              {/* Imagem Atual */}
              {currentImage && !imageBase64 && !previewImage && (
                <div className="relative inline-block mb-4">
                  <img
                    src={`/api/images/permissionarios/${currentImage
                      .split("/")
                      .pop()}`}
                    alt="Foto atual"
                    className="max-w-[200px] max-h-[200px] object-cover border-2 border-gray-200 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeCurrentImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>
              )}

              {/* Preview da imagem selecionada */}
              {previewImage && (
                <div className="relative inline-block mb-4">
                  <img
                    src={previewImage}
                    alt="Imagem selecionada"
                    className="max-w-[200px] max-h-[200px] object-cover border-2 border-blue-200 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeCurrentImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>
              )}

              {/* Imagem capturada */}
              {imageBase64 && !previewImage && (
                <div className="relative inline-block mb-4">
                  <img
                    src={imageBase64}
                    alt="Nova foto capturada"
                    className="max-w-[200px] max-h-[200px] object-cover border-2 border-green-200 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeCurrentImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>
              )}

              {/* Botões de ação */}
              {!currentImage && !imageBase64 && !previewImage && (
                <button
                  type="button"
                  onClick={openFileSelector}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ImageIcon size={20} />
                  Selecionar Imagem do Arquivo
                </button>
              )}

              {(currentImage || imageBase64 || previewImage) && (
                <button
                  type="button"
                  onClick={openFileSelector}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2"
                >
                  <ImageIcon size={16} />
                  Selecionar Arquivo
                </button>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Selecione uma foto do permissionário (máximo 5MB)
              </p>
            </div>

            {/* Botões de Submit */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/lista-permissionarios")}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {loading
                  ? toEdit
                    ? "Atualizando..."
                    : "Cadastrando..."
                  : toEdit
                  ? "Atualizar Permissionário"
                  : "Cadastrar Permissionário"}
              </button>
            </div>

            {/* QR Code Section */}
            {toEdit && imgUrl && (
              <div className="mt-8 text-center border-t pt-6">
                <div className="bg-orange-100 text-orange-900 font-semibold px-4 py-2 rounded-md inline-block mb-4">
                  QR Code do Permissionário
                </div>
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={imgUrl}
                    alt="QR Code"
                    className="w-[200px] h-[200px] border-2 border-gray-200 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleDownloadQRCode}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    <DownloadIcon size={18} />
                    Baixar QR Code
                  </button>
                  <p className="text-xs text-gray-500 text-center max-w-md">
                    Use este QR Code para acesso rápido do permissionário
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionarioForm;
