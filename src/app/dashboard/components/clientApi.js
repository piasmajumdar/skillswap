"use client";

import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

export async function clientApi(path, options = {}) {
  const { data: tokenData } = await authClient.token();

  const response = await fetch(`${API_URL.replace(/\/$/, "")}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(tokenData?.token
        ? { Authorization: `Bearer ${tokenData.token}` }
        : {}),
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
