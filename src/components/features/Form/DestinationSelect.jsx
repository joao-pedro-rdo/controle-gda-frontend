import { useDestinations } from "../../../hooks/useDestinations";

// Dropdown com as seções cadastradas em Configurações (mesma lista dos
// destinos de visitante). Um valor antigo fora da lista continua aparecendo
// para não ser apagado ao editar.
const DestinationSelect = ({ id = "section", name = "section", label = "Seção", defaultValue = "", required = false, className = "" }) => {
    const { destinations, loading } = useDestinations();
    const options =
        defaultValue && !destinations.includes(defaultValue)
            ? [defaultValue, ...destinations]
            : destinations;

    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                // remonta quando a lista chega, para o defaultValue ser aplicado
                key={loading ? "loading" : "ready"}
                id={id}
                name={name}
                defaultValue={defaultValue}
                required={required}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
            >
                <option value="">{loading ? "Carregando..." : "Selecione..."}</option>
                {options.map((destination) => (
                    <option key={destination} value={destination}>{destination}</option>
                ))}
            </select>
        </div>
    );
};

export default DestinationSelect;
