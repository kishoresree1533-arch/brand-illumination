/**
 * Wraps fetch() with automatic X-Admin-Token header injection.
 * On 401, clears localStorage and redirects to /admin login.
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("admin_token") || "";
  const headers = new Headers(options.headers as HeadersInit);
  headers.set("X-Admin-Token", token);

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    window.location.href = "/admin";
  }

  return response;
}
