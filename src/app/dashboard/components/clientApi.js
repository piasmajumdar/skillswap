const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || "http://localhost:8000";

export async function clientApi(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || "Request failed.");
  }

  return body;
}

export const withEmail = (email) =>
  encodeURIComponent(
    String(email || "")
      .trim()
      .toLowerCase(),
  );
