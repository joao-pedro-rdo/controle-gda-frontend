// Identidade visual do sistema (título, logo, fundo e cores).
//
// Os valores vêm de `window.__APP_CONFIG__`, definido em `/config.js`. Em
// desenvolvimento esse arquivo é o `public/config.js`; no Docker ele é gerado
// na subida do container a partir do `.env` (ver `docker/40-app-config.sh`).
// Assim todos os dispositivos veem a mesma identidade, sem upload pela tela.

export interface Branding {
  title: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  background: string;
}

declare global {
  interface Window {
    __APP_CONFIG__?: Partial<Branding>;
  }
}

const DEFAULTS: Branding = {
  title: "Guarda - 6° RCB",
  primaryColor: "#dc2626",
  secondaryColor: "#991b1b",
  logo: "/img/logo.png",
  background: "/img/bg-cover.png",
};

function readRuntimeConfig(): Readonly<Branding> {
  const runtime: Partial<Branding> =
    (typeof window !== "undefined" && window.__APP_CONFIG__) || {};
  const config: Branding = { ...DEFAULTS };
  (Object.keys(DEFAULTS) as (keyof Branding)[]).forEach((key) => {
    const value = runtime[key];
    if (typeof value === "string" && value.trim() !== "") {
      config[key] = value;
    }
  });
  return Object.freeze(config);
}

export const branding = readRuntimeConfig();

export const DEFAULT_LOGO = DEFAULTS.logo;

// Aplica título da aba e favicon. Chamado uma vez na inicialização.
export function applyDocumentBranding(): void {
  document.title = branding.title;

  document.querySelectorAll('link[rel*="icon"]').forEach((icon) => icon.remove());
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = branding.logo;
  document.head.appendChild(link);
}

// Hook para componentes. A configuração é estática durante a sessão: trocar a
// identidade exige reiniciar o container e recarregar a página.
export function useBranding(): Readonly<Branding> {
  return branding;
}
