const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

const isBrowser = typeof window !== "undefined";

const isLocalHostname = (hostname) => LOCAL_HOSTNAMES.has(hostname);

const getConfiguredApiUrl = () => process.env.REACT_APP_API_URL?.trim() || "";

export const getApiBaseUrl = () => {
  const configuredUrl = getConfiguredApiUrl();

  if (!configuredUrl) {
    return "/api";
  }

  if (!isBrowser) {
    return configuredUrl;
  }

  try {
    const resolvedUrl = new URL(configuredUrl, window.location.origin);
    const configuredIsLocal = isLocalHostname(resolvedUrl.hostname);
    const currentIsLocal = isLocalHostname(window.location.hostname);

    if (configuredIsLocal && !currentIsLocal) {
      return "/api";
    }

    if (resolvedUrl.origin === window.location.origin) {
      return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}` || "/api";
    }

    return resolvedUrl.toString();
  } catch {
    if (configuredUrl.startsWith("/")) {
      return configuredUrl;
    }

    return "/api";
  }
};

export const getAssetUrl = (assetPath) => {
  if (!assetPath) {
    return assetPath;
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const baseUrl = getApiBaseUrl();

  if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
    return new URL(assetPath, `${baseUrl.replace(/\/$/, "")}/`).toString();
  }

  return `${baseUrl.replace(/\/$/, "")}/${assetPath.replace(/^\//, "")}`;
};
