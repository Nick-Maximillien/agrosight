// lib/api.ts

  export async function fetchWithAuth(url: string, token: string | null, options: RequestInit = {}) {
    if (!token) throw new Error('No token provided')
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
  }
