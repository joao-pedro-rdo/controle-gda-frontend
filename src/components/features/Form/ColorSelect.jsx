import { useState } from "react";
import { COLOR_OPTIONS } from "../../../utils/validation";

const OTHER = "__outra__";

// Dropdown de cor com as cores mais comuns e "Outra" (campo livre).
// O valor final vai no input oculto `name`, então funciona em forms não
// controlados (FormData). Cor antiga fora da lista abre como "Outra".
const ColorSelect = ({ id = "color", name = "color", label = "Cor", defaultValue = "", required = false, disabled = false }) => {
    const initialInList = !defaultValue || COLOR_OPTIONS.includes(defaultValue);
    const [choice, setChoice] = useState(initialInList ? defaultValue : OTHER);
    const [other, setOther] = useState(initialInList ? "" : defaultValue);

    const value = choice === OTHER ? other : choice;
    const inputClass =
        "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100";

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                id={id}
                value={choice}
                onChange={(event) => setChoice(event.target.value)}
                required={required}
                disabled={disabled}
                className={inputClass}
            >
                <option value="">Selecione...</option>
                {COLOR_OPTIONS.map((color) => (
                    <option key={color} value={color}>{color}</option>
                ))}
                <option value={OTHER}>Outra...</option>
            </select>
            {choice === OTHER && (
                <input
                    type="text"
                    aria-label="Outra cor"
                    placeholder="Digite a cor"
                    value={other}
                    onChange={(event) => setOther(event.target.value)}
                    maxLength={20}
                    required={required}
                    disabled={disabled}
                    className={inputClass}
                />
            )}
            <input type="hidden" name={name} value={disabled ? "" : value} />
        </div>
    );
};

export default ColorSelect;
