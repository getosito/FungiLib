const API_BASE = "http://localhost:4000";

export async function getFungi() {
  const res = await fetch(`${API_BASE}/api/fungi`);
  if (!res.ok) throw new Error("Failed to fetch fungi");
  return res.json();
}
