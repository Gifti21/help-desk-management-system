/**
 * Safe JSON response handler for API calls.
 * Prevents "Unexpected token '<', '<!DOCTYPE '... is not valid JSON" errors
 * when endpoints return non-JSON responses (e.g. 404 HTML, 500 HTML error pages, redirects).
 */
export async function handleJsonResponse<T = any>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!isJson) {
    const rawText = await response.text().catch(() => "");
    const snippet = rawText.trim().substring(0, 150);
    throw new Error(
      `Server returned non-JSON response (${response.status} ${response.statusText}): ${snippet || "Empty response"}`
    );
  }

  let data: any;
  try {
    data = await response.json();
  } catch (parseError: any) {
    throw new Error(
      `Failed to parse JSON response (${response.status}): ${parseError?.message || "Invalid JSON"}`
    );
  }

  if (!response.ok) {
    const errorMessage =
      data?.error ||
      data?.message ||
      (Array.isArray(data?.details)
        ? data.details.map((d: any) => `${d.path?.join(".") || "field"}: ${d.message}`).join(", ")
        : null) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}
