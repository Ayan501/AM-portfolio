const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

async function request<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("The portfolio API could not be reached. Please try again later.");
  }

  const payload = (await response.json().catch(() => ({}))) as { detail?: string };
  if (!response.ok) throw new Error(payload.detail || "The request could not be completed.");
  return payload as T;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

export function sendContact(message: ContactMessage): Promise<{ status: string }> {
  return request<{ status: string }>("/api/contact", message);
}