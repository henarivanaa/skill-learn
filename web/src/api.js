export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const baseUrl = import.meta.env.VITE_API_URL || "";

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Server tidak dapat dihubungi.", 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message || "Permintaan gagal.", response.status);
  }
  return data;
}
