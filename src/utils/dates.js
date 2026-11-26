// Datas no fuso do navegador. `toISOString()` usa UTC, então à noite no
// Brasil (UTC-3) ele já aponta para o dia seguinte; use estes helpers para
// "hoje", campos <input type="date"> e intervalos de um dia.

const pad = (value) => String(value).padStart(2, "0");

// YYYY-MM-DD do dia local (valor de <input type="date">).
export function localDateInput(date = new Date()) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// HH:mm local (valor de <input type="time">).
export function localTimeInput(date = new Date()) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Início do dia local (00:00) e início do dia seguinte, como instantes ISO.
export function localDayRange(date = new Date()) {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { from: start.toISOString(), to: end.toISOString() };
}
