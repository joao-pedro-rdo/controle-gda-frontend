import InputMask from "react-input-mask";

const InputField = ({
    id,
    name,
    label,
    type = "text",
    placeholder,
    required = false,
    defaultValue,
    mask,
    pattern,
    title,
    minLength,
    maxLength,
    className = "",
    ...props
}) => {
    const InputComponent = mask ? InputMask : "input";

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <InputComponent
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                required={required}
                defaultValue={defaultValue}
                mask={mask}
                pattern={pattern}
                title={title}
                minLength={minLength}
                maxLength={maxLength}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 ${className}`}
                {...props}
            />
        </div>
    );
};

export default InputField;
