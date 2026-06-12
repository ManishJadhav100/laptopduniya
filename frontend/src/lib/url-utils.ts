export function formatImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  const isServer = typeof window === "undefined";
  const apiBase = isServer 
    ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL) 
    : process.env.NEXT_PUBLIC_API_URL;
    
  let apiHost = (apiBase || '').replace('/api/v1', '').replace(/\/$/, '');

  // If the host is just empty (relative API), fallback to backend name on server or localhost on client
  if (!apiHost || apiHost.startsWith('/')) {
    apiHost = isServer ? 'http://localhost:8000' : '';
  }

  // If the URL is already absolute, return it
  if (url.startsWith('http')) return url;

  // Ensure path starts with /
  const path = url.startsWith('/') ? url : `/${url}`;
  
  return `${apiHost}${path}`;
}

export function getCanonicalUrl(path: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://phoneradar.in';
  return `${siteUrl}${path}`;
}
