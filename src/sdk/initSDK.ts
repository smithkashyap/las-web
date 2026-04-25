import { CoreSDK } from 'las-core-sdk';
import type { HttpClient, Storage } from 'las-core-sdk';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const TOKEN_KEY = 'las_access_token';

const storage: Storage = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key),
};

const httpClient: HttpClient = {
  async get<T>(path: string): Promise<T> {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${path}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json() as Promise<T>;
  },

  async post<T, B>(path: string, body: B): Promise<T> {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json() as Promise<T>;
  },
};

export const sdk = new CoreSDK({ httpClient, storage });
