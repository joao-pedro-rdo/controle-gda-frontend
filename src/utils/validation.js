// Regras de validação dos formulários. Espelham `backend/src/lib/text-rules.ts`:
// o backend continua sendo quem decide, aqui só antecipamos o erro para o
// usuário não perder o preenchimento.

export const PERSON_NAME_PATTERN = /^[\p{L}\s'.-]+$/u;
export const SHORT_TEXT_PATTERN = /^[\p{L}\p{N}\s'.,/()ºª°&-]+$/u;
export const LONG_TEXT_PATTERN = /^[\p{L}\p{N}\s'.,/()ºª°&:;!?"%+-]+$/u;

// Cores mais comuns da frota. "Outra" abre um campo livre.
export const COLOR_OPTIONS = [
  "Branco",
  "Preto",
  "Prata",
  "Cinza",
  "Vermelho",
  "Azul",
  "Verde",
  "Bege",
  "Marrom",
  "Amarelo",
  "Laranja",
  "Vinho",
];

export function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function isValidCpf(value) {
  const cpf = digitsOnly(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const check = (length) => {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(cpf[i]) * (length + 1 - i);
    const rest = sum % 11;
    return (rest < 2 ? 0 : 11 - rest) === Number(cpf[length]);
  };
  return check(9) && check(10);
}

export function formatCpf(value) {
  const cpf = digitsOnly(value);
  if (cpf.length !== 11) return value || "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function isValidPlate(value) {
  const plate = String(value ?? "").replace(/[\s.-]/g, "").toUpperCase();
  return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(plate);
}

// Regras por campo: { campo: [rótulo, tipo, obrigatório] }.
// Tipos: name, text, longText, cpf, cnh, plate.
export function validateFields(data, rules) {
  const errors = [];
  Object.entries(rules).forEach(([field, [label, kind, required]]) => {
    const value = String(data[field] ?? "").trim();
    // Campo de documento com só a máscara ("___.___.___-__") conta como vazio.
    const isEmptyDocument = (kind === "cpf" || kind === "cnh") && digitsOnly(value) === "";
    if (!value || isEmptyDocument) {
      if (required) errors.push(`${label} é obrigatório`);
      return;
    }
    switch (kind) {
      case "name":
        if (!PERSON_NAME_PATTERN.test(value)) {
          errors.push(`${label}: use apenas letras, espaços, apóstrofo, ponto ou hífen`);
        }
        break;
      case "text":
        if (!SHORT_TEXT_PATTERN.test(value)) errors.push(`${label} contém caracteres não permitidos`);
        break;
      case "longText":
        if (!LONG_TEXT_PATTERN.test(value)) errors.push(`${label} contém caracteres não permitidos`);
        break;
      case "cpf":
        if (!isValidCpf(value)) errors.push(`${label} inválido`);
        break;
      case "cnh":
        if (digitsOnly(value).length !== 11) errors.push(`${label} deve ter 11 dígitos`);
        break;
      case "plate":
        if (!isValidPlate(value)) errors.push(`${label} inválida (ABC1234 ou ABC1D23)`);
        break;
      default:
        break;
    }
  });
  return errors;
}

// Extrai a mensagem de erro do backend ({ error, details: [{ field, message }] }).
export function apiErrorMessage(error, fallback) {
  const body = error?.response?.data;
  const details = Array.isArray(body?.details)
    ? body.details.map((detail) => detail.message).filter(Boolean)
    : [];
  if (details.length > 0) return details.join(" • ");
  return body?.error || body?.message || fallback;
}
