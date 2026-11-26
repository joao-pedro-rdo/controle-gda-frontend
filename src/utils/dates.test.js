import { localDateInput, localDayRange, localTimeInput } from "./dates";

describe("dates", () => {
    it("formata data e hora no fuso local", () => {
        const date = new Date(2026, 10, 26, 23, 44);
        expect(localDateInput(date)).toBe("2026-11-26");
        expect(localTimeInput(date)).toBe("23:44");
    });

    it("intervalo do dia local inclui um horário às 23:44", () => {
        const date = new Date(2026, 10, 26, 23, 44);
        const { from, to } = localDayRange(date);
        expect(new Date(from).getTime()).toBeLessThanOrEqual(date.getTime());
        expect(new Date(to).getTime()).toBeGreaterThan(date.getTime());
        expect(new Date(to).getTime() - new Date(from).getTime()).toBeGreaterThanOrEqual(23 * 3600 * 1000);
    });
});
