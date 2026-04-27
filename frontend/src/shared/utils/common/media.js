import { api } from "@/shared/services/api";

export function resolveMediaUrl(path) {
  if (!path) {
    return "";
  }

  if (typeof path !== "string") {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const url = new URL(path);
      const apiOrigin = new URL(api.defaults.baseURL).origin;

      if (url.pathname.startsWith("/storage/") && url.origin !== apiOrigin) {
        return `${apiOrigin}${url.pathname}`;
      }

      return path;
    } catch {
      return path;
    }
  }

  if (path.startsWith("/storage/")) {
    const origin = new URL(api.defaults.baseURL).origin;
    return `${origin}${path}`;
  }

  if (path.startsWith("storage/")) {
    const origin = new URL(api.defaults.baseURL).origin;
    return `${origin}/${path}`;
  }

  if (!path.startsWith("data:") && !path.startsWith("blob:")) {
    const origin = new URL(api.defaults.baseURL).origin;
    return `${origin}/storage/${path.replace(/^\/+/, "")}`;
  }

  return path;
}
