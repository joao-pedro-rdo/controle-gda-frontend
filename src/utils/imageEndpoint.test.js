import { imageEndpoint } from "./imageEndpoint";

describe("imageEndpoint", () => {
    it("usa a pasta do caminho gravado", () => {
        expect(imageEndpoint("/uploads/visitors/visitor_1.jpg.encrypted")).toBe(
            "/images/visitors/visitor_1.jpg.encrypted"
        );
        expect(imageEndpoint("/uploads/visitors/foto-antiga.jpg")).toBe("/images/visitors/foto-antiga.jpg");
        expect(imageEndpoint("/uploads/pessoas-nao-autorizadas/x.jpg")).toBe(
            "/images/pessoas-nao-autorizadas/x.jpg"
        );
    });

    it("cai no prefixo do arquivo quando não há pasta", () => {
        expect(imageEndpoint("permissionario_2.jpg.encrypted")).toBe(
            "/images/permissionarios/permissionario_2.jpg.encrypted"
        );
    });

    it("retorna null para caminho vazio ou desconhecido", () => {
        expect(imageEndpoint(null)).toBeNull();
        expect(imageEndpoint("")).toBeNull();
        expect(imageEndpoint("N/A")).toBeNull();
        expect(imageEndpoint("/outra/pasta/foto.jpg")).toBeNull();
    });
});
