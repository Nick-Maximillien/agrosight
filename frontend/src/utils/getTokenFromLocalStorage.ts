export function getTokenFromLocalStorage(): string | null {
  if (typeof window !== 'undefined') {
    // Access localStorage only in the client-side environment
    const storedToken = localStorage.getItem('token');
    return storedToken ? storedToken : null;
  }
  return null;
}
