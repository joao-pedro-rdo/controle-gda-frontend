// Converte o imagePath gravado no banco (ex.: /uploads/visitors/visitor_1.jpg.encrypted)
// na rota autenticada do backend que entrega a imagem. Usa a pasta do caminho e,
// se ela não vier, o prefixo do arquivo. Retorna null quando não reconhece.
const FOLDERS = {
    visitors: "visitors",
    permissionarios: "permissionarios",
    "pessoas-nao-autorizadas": "pessoas-nao-autorizadas",
};

const PREFIXES = [
    ["visitor_", "visitors"],
    ["permissionario_", "permissionarios"],
    ["pessoa_nao_autorizada_", "pessoas-nao-autorizadas"],
];

export function imageEndpoint(imagePath) {
    if (typeof imagePath !== "string" || !imagePath.trim()) return null;
    const parts = imagePath.trim().split("/").filter(Boolean);
    const filename = parts.pop();
    if (!filename) return null;

    const folder = FOLDERS[parts[parts.length - 1]];
    const byPrefix = PREFIXES.find(([prefix]) => filename.startsWith(prefix));
    const target = folder || (byPrefix && byPrefix[1]);
    return target ? `/images/${target}/${encodeURIComponent(filename)}` : null;
}
