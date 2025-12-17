import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import client from '../../../services/client';
import {
    Box,
    Badge,
    Input,
    InputGroup,
    InputLeftElement,
    Icon,
    Text,
    VStack,
    HStack,
    Divider,
    Image
} from "@chakra-ui/react";
import { FaSearch, FaExclamationTriangle } from "react-icons/fa";

const UnauthorizedPanel = () => {
    const auth = useAuth();
    const [pessoasNaoAutorizadas, setPessoasNaoAutorizadas] = useState([]);
    const [filteredPessoas, setFilteredPessoas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth.user.role === "Guarda") {
            loadPessoasNaoAutorizadas();
        }
    }, [auth.user.role]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredPessoas(pessoasNaoAutorizadas);
        } else {
            const searchLower = searchTerm.toLowerCase();
            const searchNumbers = searchTerm.replace(/\D/g, "");

            const filtered = pessoasNaoAutorizadas.filter((pessoa) => {
                const nomeMatch = pessoa.nome?.toLowerCase().includes(searchLower);
                const cpfNumbers = pessoa.CPF?.replace(/\D/g, "");
                const cpfMatch = searchNumbers && cpfNumbers && cpfNumbers.includes(searchNumbers);
                const identidadeMatch = pessoa.identidade?.toLowerCase().includes(searchLower);
                return nomeMatch || cpfMatch || identidadeMatch;
            });
            setFilteredPessoas(filtered);
        }
    }, [searchTerm, pessoasNaoAutorizadas]);

    const loadPessoasNaoAutorizadas = async () => {
        try {
            setLoading(true);
            const response = await client.get("/pessoas-nao-autorizadas");
            setPessoasNaoAutorizadas(response.data);
            setFilteredPessoas(response.data);
        } catch (error) {
            console.error("Erro ao carregar pessoas não autorizadas:", error);
        } finally {
            setLoading(false);
        }
    };

    if (auth.user.role !== "Guarda") {
        return null;
    }

    return (
        <div className="w-80 bg-gray-100 border-r-2 border-gray-300 p-4 overflow-y-auto fixed left-0 top-20 bottom-0 z-10">
            <div className="space-y-3">
                <Badge
                    fontSize="1rem"
                    colorScheme="red"
                    p={2}
                    textAlign="center"
                    borderRadius="md"
                    className="w-full"
                >
                    <Icon as={FaExclamationTriangle} mr={2} />
                    NÃO AUTORIZADOS
                </Badge>

                <InputGroup size="sm">
                    <InputLeftElement>
                        <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Buscar por nome ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="white"
                    />
                </InputGroup>

                <p className="text-xs text-gray-600 text-center">
                    {filteredPessoas.length} pessoa(s) encontrada(s)
                </p>

                <Divider />

                {loading ? (
                    <p className="text-center">Carregando...</p>
                ) : (
                    <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                        {filteredPessoas.map((pessoa) => (
                            <div key={pessoa.id} className="p-3 bg-white border border-red-200 rounded-md shadow-sm">
                                <div className="flex space-x-3">
                                    {pessoa.imagePath && (
                                        <Image
                                            src={`/api/images/pessoas-nao-autorizadas/${pessoa.imagePath.split("/").pop()}`}
                                            alt="Foto"
                                            boxSize="40px"
                                            objectFit="cover"
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="gray.300"
                                        />
                                    )}
                                    <div className="flex-1 space-y-1">
                                        <p className="text-xs font-bold text-red-700">{pessoa.nome}</p>
                                        <p className="text-xs text-gray-600">CPF: {pessoa.CPF}</p>
                                        {pessoa.identidade && <p className="text-xs text-gray-600">ID: {pessoa.identidade}</p>}
                                        {pessoa.observacao && <p className="text-xs text-red-600 italic">{pessoa.observacao}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredPessoas.length === 0 && !loading && (
                            <p className="text-center text-gray-500 text-sm">
                                {searchTerm ? "Nenhuma pessoa encontrada" : "Nenhuma pessoa não autorizada cadastrada"}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnauthorizedPanel;
