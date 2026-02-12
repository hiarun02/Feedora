/**
 * Get the base URL based on environment
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Browser environment
    return window.location.origin;
  }

  // Server environment
  const authUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL;
  if (authUrl) {
    return authUrl;
  }

  // Fallback for Vercel
  if (process.env.VERCEL) {
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
      return `https://${vercelUrl}`;
    }
  }

  return "http://localhost:3000";
}

/**
 * Get the API base URL (for internal server-to-server calls)
 */
export function getApiBaseUrl() {
  const internalUrl =
    process.env.NEXTAUTH_URL_INTERNAL || process.env.NEXTAUTH_URL;
  if (internalUrl) {
    return internalUrl;
  }

  if (process.env.VERCEL) {
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
      return `https://${vercelUrl}`;
    }
  }

  return "http://localhost:3000";
}

/**
 * Get the feedback API endpoint URL
 */
export function getFeedbackApiUrl() {
  return `${getBaseUrl()}/api/feedback`;
}

/**
 * Get the widget script URL
 */
export function getWidgetScriptUrl() {
  return `${getBaseUrl()}/widget/widget.js`;
}
