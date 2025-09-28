export async function readErrorResponse(response: Response): Promise<string> {
  try {
    const data = await response.clone().json();
    if (data == null) {
      return "<empty>";
    }

    if (typeof data === "object" && "detail" in data) {
      const detail = (data as { detail?: unknown }).detail;
      if (typeof detail === "string") {
        return detail;
      }
      return JSON.stringify(detail);
    }

    if (typeof data === "string") {
      return data;
    }

    return JSON.stringify(data);
  } catch {
    try {
      return await response.clone().text();
    } catch {
      return "<unreadable>";
    }
  }
}
