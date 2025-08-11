// src/api.ts
const API_BASE =
  import.meta.env.VITE_API_ORIGIN ?? 'https://api.uberli.ch';

export async function storeSecret(encrypted: string) {
  const res = await fetch(`${API_BASE}/api/secret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value: encrypted }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ id: string }>;
}

export async function readSecret(id: string) {
  const res = await fetch(`${API_BASE}/api/secret/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ value: string }>;
}
