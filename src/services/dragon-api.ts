import type { Dragon } from "@/types/dragon";
import {
  setDragonImageLocal,
  getDragonImageLocal,
  deleteDragonImageLocal,
} from "@/lib/image-storage";

const API_BASE = "https://5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon";

/** Busca todos os dragões e combina com imagens salvas */
export async function fetchDragons(): Promise<Dragon[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Falha ao buscar dragões");
  const data: Dragon[] = await res.json();

  // Enriquecer com imagens locais salvas
  const enriched = await Promise.all(
    data.map(async (dragon) => {
      const localImg = await getDragonImageLocal(dragon.id);
      return {
        ...dragon,
        imageUrl: localImg || dragon.imageUrl || undefined,
      };
    })
  );

  return enriched.sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", "pt-BR")
  );
}

/** Busca um dragão por ID */
export async function fetchDragonById(id: string): Promise<Dragon> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Dragão não encontrado");
  const data: Dragon = await res.json();
  const localImg = await getDragonImageLocal(id);

  return {
    ...data,
    imageUrl: localImg || data.imageUrl || undefined,
  };
}

/** Cria um novo dragão e associa imagem com segurança de payload */
export async function createDragon(
  data: Pick<Dragon, "name" | "type"> & { imageUrl?: string }
): Promise<Dragon> {
  // Se for base64 (data:), não enviamos na MockAPI para evitar o erro 413 (Payload Too Large)
  const isBase64 = data.imageUrl?.startsWith("data:");
  const apiPayload: { name: string; type: string; imageUrl?: string } = {
    name: data.name,
    type: data.type,
  };

  if (data.imageUrl && !isBase64) {
    apiPayload.imageUrl = data.imageUrl;
  }

  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiPayload),
  });
  if (!res.ok) throw new Error("Falha ao criar dragão no servidor");
  const created: Dragon = await res.json();

  // Salva no banco de imagens local
  if (data.imageUrl && created.id) {
    await setDragonImageLocal(created.id, data.imageUrl);
  }

  return {
    ...created,
    imageUrl: data.imageUrl || created.imageUrl,
  };
}

/** Atualiza um dragão existente com segurança de payload */
export async function updateDragon(
  id: string,
  data: Partial<Pick<Dragon, "name" | "type">> & { imageUrl?: string }
): Promise<Dragon> {
  const isBase64 = data.imageUrl?.startsWith("data:");
  const apiPayload: Partial<Pick<Dragon, "name" | "type">> & { imageUrl?: string } = {};

  if (data.name !== undefined) apiPayload.name = data.name;
  if (data.type !== undefined) apiPayload.type = data.type;
  if (data.imageUrl !== undefined && !isBase64) {
    apiPayload.imageUrl = data.imageUrl;
  }

  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiPayload),
  });
  if (!res.ok) throw new Error("Falha ao atualizar dragão no servidor");
  const updated: Dragon = await res.json();

  if (data.imageUrl !== undefined) {
    if (data.imageUrl) {
      await setDragonImageLocal(id, data.imageUrl);
    } else {
      await deleteDragonImageLocal(id);
    }
  }

  return {
    ...updated,
    imageUrl: data.imageUrl || updated.imageUrl,
  };
}

/** Remove um dragão pelo ID e limpa imagem local */
export async function deleteDragon(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Falha ao remover dragão");
  await deleteDragonImageLocal(id);
}
