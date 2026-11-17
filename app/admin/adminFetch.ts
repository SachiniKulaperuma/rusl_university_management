export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = localStorage.getItem("adminToken");

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    window.location.assign("/admin/signin");
  }

  return response;
}