/**
 * Helper to resolve database image paths.
 * Prepend /brand-illumination if running locally in a subdirectory under XAMPP,
 * otherwise keep it root-relative for production.
 */
export function resolveImagePath(path: string | undefined | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  
  // Detect if running locally in XAMPP subdirectory
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/brand-illumination")
    ? "/brand-illumination"
    : "";
    
  let cleanPath = path;
  // Strip duplicate base path if present
  if (base && path.startsWith(base)) {
    cleanPath = path.substring(base.length);
  }
  
  // Ensure path starts with a single slash
  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath;
  }
  
  return base + cleanPath;
}
