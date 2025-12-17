const FormSection = ({ title, children }) => {
    return (
        <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {children}
            </div>
        </div>
    );
};

export default FormSection;
