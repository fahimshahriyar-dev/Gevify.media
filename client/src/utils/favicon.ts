import { API_BASE } from "../config";

const DEFAULT_LOGO =
  "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786910291/logo_o11gn5.png";

/**
 * Builds a deterministic, PNG-based favicon URL for the given logo image.
 * Forces a fixed format (f_png) and size (w_64) so every device and browser
 * shows the exact same icon regardless of Cloudinary's f_auto format
 * heuristics (which can deliver AVIF/WebP on some devices and break
 * favicon rendering there).
 */
const toFaviconUrl = (url: string): string => {
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const [base, rest] = url.split("/upload/");
    const parts = rest.split("/");
    const first = parts[0] || "";
    const hasTransform = /(^|,)f[a-z]*_|(^|,)q_|(^|,)w_/.test(first);
    const resource = hasTransform ? parts.slice(1).join("/") : rest;
    return `${base}/upload/f_png,q_auto,w_64/${resource}`;
  }
  return url;
};

/**
 * Updates the browser tab favicon to the given logo image URL.
 * Reuses an existing link[rel=icon] element or creates one dynamically.
 */
export const updateFavicon = (url: string): void => {
  if (!url) return;
  const href = toFaviconUrl(url);
  let link: HTMLLinkElement | null = document.querySelector(
    'link[rel~="icon"]',
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/png";
  link.href = href;
};

/**
 * Applies the default logo favicon immediately (synchronously) so the tab
 * never flashes the old static icon, then fetches the current logo from
 * dynamic content and applies it once available.
 */
export const syncFaviconFromContent = async (): Promise<void> => {
  updateFavicon(DEFAULT_LOGO);
  try {
    const res = await fetch(`${API_BASE}/api/content`);
    const data = await res.json();
    if (data && data.logo) updateFavicon(data.logo);
  } catch {
    // Ignore errors; keep the default logo favicon
  }
};