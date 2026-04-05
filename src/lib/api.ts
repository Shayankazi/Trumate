const rawBase = (import.meta as any).env?.VITE_API_URL as string | undefined;

const base = (rawBase || '').replace(/\/$/, '');

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}

