export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchBarangList() {
  const res = await fetch(`${BASE_URL}/api/barang/`);
  if (!res.ok) throw new Error("Gagal mengambil data barang");
  const json = await res.json();
  return json.data.barang;
}

export async function fetchBarang(id: number) {
  const res = await fetch(`${BASE_URL}/api/barang/${id}`);
  if (!res.ok) throw new Error("Gagal mengambil detail barang");
  const json = await res.json();
  return json.data;
}

export async function createBarang(data: FormData) {
  const res = await fetch(`${BASE_URL}/api/barang/`, {
    method: "POST",
    body: data,
  });
  if (!res.ok) throw new Error("Gagal menambah barang");
  return await res.json();
}

export async function updateBarang(id: number, data: FormData) {
  const res = await fetch(`${BASE_URL}/api/barang/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!res.ok) throw new Error("Gagal mengupdate barang");
  return await res.json();
}

export async function deleteBarang(id: number) {
  const res = await fetch(`${BASE_URL}/api/barang/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal menghapus barang");
  return await res.json();
}
