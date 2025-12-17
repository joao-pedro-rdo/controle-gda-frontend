import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InputMask from "react-input-mask";
import client from "../../services/client.js";

const ScheduleVisitorForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const scheduleDate = formData.get("scheduleDate");
    const scheduleTime = formData.get("scheduleTime");

    if (!scheduleDate || !scheduleTime) {
      alert("Por favor, preencha data e hora do agendamento");
      setIsLoading(false);
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

    if (scheduledDateTime <= new Date()) {
      alert("A data e hora do agendamento deve ser futura");
      setIsLoading(false);
      return;
    }

    const data = {
      isVisitor: true,
      isScheduled: true,
      scheduledDate: scheduledDateTime.toISOString(),
      name: formData.get("completeName"),
      idNumber: formData.get("idNumber"),
      phoneNumber: formData.get("phoneNumber"),
      licensePlate: formData.get("licensePlate"),
      carModel: formData.get("carModel"),
      color: formData.get("color"),
      contactPerson: formData.get("contactPerson"),
      target: formData.get("section"),
      type: "Entrada",
    };

    try {
      await client.post("/entries/schedule", data);
      alert("Agendamento realizado com sucesso!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Erro ao agendar visitante:", error);
      alert("Erro ao realizar agendamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="w-full">
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
            <div className="flex">
              <div className="py-1">
                <svg className="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>
              </div>
              <div>
                <p className="font-bold">Agendamento de Visitante</p>
                <p className="text-sm">A foto será capturada pela guarda no momento da entrada.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Dados do Agendamento */}
            <div className="w-full p-2 h-auto min-h-[200px] max-h-[400px]">
              <span className="text-lg mb-4 inline-block bg-blue-500 text-white px-2 py-1 rounded">
                Dados do Agendamento
              </span>
              <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700">Data do Agendamento</label>
              <input
                type="date"
                name="scheduleDate"
                required
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 mt-4">Hora do Agendamento</label>
              <input type="time" name="scheduleTime" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            {/* Dados pessoais */}
            <div className="w-full p-2 h-auto min-h-[200px] max-h-[400px]">
              <span className="text-lg mb-4 inline-block bg-red-500 text-white px-2 py-1 rounded">
                Dados pessoais
              </span>
              <label htmlFor="completeName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                type="text"
                name="completeName"
                placeholder="Nome completo do visitante"
                pattern="[A-Za-zÀ-ÿ\s]{3,}"
                title="Nome deve ter pelo menos 3 caracteres"
                minLength="3"
                className="capitalize mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mt-4">CPF do Visitante</label>
              <InputMask
                mask="999.999.999-99"
                name="idNumber"
                placeholder="000.000.000-00"
                title="Digite um CPF válido (000.000.000-00)"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mt-4">Telefone de Contato</label>
              <InputMask
                mask="(99) 99999-9999"
                name="phoneNumber"
                placeholder="(11) 99999-9999"
                title="Digite um telefone válido (DD) 9XXXX-XXXX"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Dados do veículo */}
            <div className="w-full p-2 h-auto min-h-[200px] max-h-[400px]">
              <span className="text-lg mb-4 inline-block bg-red-500 text-white px-2 py-1 rounded">
                Dados do veículo
              </span>
              <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">Modelo do veículo</label>
              <input type="text" name="carModel" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mt-4">Placa</label>
              <input
                type="text"
                name="licensePlate"
                placeholder="ABC-1234 ou ABC1D23"
                pattern="[A-Z]{3}-?[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2}"
                title="Digite uma placa brasileira válida"
                maxLength="8"
                className="uppercase mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mt-4">Cor</label>
              <input type="text" name="color" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            {/* Dados do Destino */}
            <div className="w-full p-2 h-auto min-h-[200px] max-h-[400px]">
              <span className="text-lg mb-4 inline-block bg-red-500 text-white px-2 py-1 rounded">
                Dados do Destino
              </span>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Com quem vai falar:</label>
              <input type="text" name="contactPerson" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              <label htmlFor="section" className="block text-sm font-medium text-gray-700 mt-4">Seção de Destino</label>
              <select name="section" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="">Selecione...</option>
                <option value="RP">RP</option>
                <option value="SFPC">SFPC</option>
                <option value="Cmt">Cmt</option>
                <option value="SCmt">Scmt</option>
                <option value="Estande">Estande</option>
                <option value="Adj Cmdo">Adj Cmdo</option>
                <option value="SecInfor">SecInfor</option>
                <option value="SecJur">SecJur</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
                <option value="S4">S4</option>
                <option value="Pelotões">Pelotões</option>
                <option value="SubCias">SubCias</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isLoading ? "Agendando..." : "Agendar Visitante"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ScheduleVisitorForm;
