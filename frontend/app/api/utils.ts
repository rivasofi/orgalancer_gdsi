// Safely parses a fetch response body, even if empty or non-JSON
export async function parseBody(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
}

// Extracts a readable error message from a FastAPI error response
export function extractErrorMsg(data: any, fallback: string): string {
  if (!data) return fallback;
  if (Array.isArray(data.detail))
    return data.detail.map((e: any) => e.msg.replace("Value error, ", "")).join(", ");
  return data.detail || fallback;
}