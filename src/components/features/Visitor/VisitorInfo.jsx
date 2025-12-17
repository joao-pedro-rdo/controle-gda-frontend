import { Text } from "@chakra-ui/react";

const VisitorInfo = ({ label, value }) => {
    return (
        <p className="text-sm text-gray-600">
            <strong>{label}:</strong> {value || "N/A"}
        </p>
    );
};

export default VisitorInfo;
