export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class LocalStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  }
}

export interface SiteStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  getJSON<T>(key: string, fallback: T): T;
  setJSON(key: string, value: unknown): void;
}

export function createSiteStorage(adapter: StorageAdapter): SiteStorage {
  return {
    getItem: (key: string) => adapter.getItem(key),
    setItem: (key: string, value: string) => adapter.setItem(key, value),
    removeItem: (key: string) => adapter.removeItem(key),
    getJSON<T>(key: string, fallback: T): T {
      const raw = adapter.getItem(key);
      if (!raw) return fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },
    setJSON(key: string, value: unknown): void {
      adapter.setItem(key, JSON.stringify(value));
    },
  };
}

// This adapter is intentionally isolated so it can be replaced by Firebase/Supabase later.
export const siteStorage = createSiteStorage(new LocalStorageAdapter());
