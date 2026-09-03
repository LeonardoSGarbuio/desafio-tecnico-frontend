import { Dragon, DragonFormData } from "../types/dragon-types";

const API_BASE_URL = "https://5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon";

// Helper para tratar e normalizar o histórico
export function normalizeHistories(histories?: string[] | string): string[] {
  if (!histories) return [];
  if (Array.isArray(histories)) {
    return histories.filter((h) => typeof h === "string" && h.trim().length > 0);
  }
  if (typeof histories === "string" && histories.trim().length > 0) {
    // Pode vir separado por quebra de linha ou vírgula
    return histories
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export const dragonApi = {
  /**
   * Busca a lista de dragões da API e ordena em ordem alfabética (conforme especificado no teste)
   */
  async getDragons(): Promise<Dragon[]> {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Falha ao buscar dragões: ${response.statusText}`);
    }

    const data: Dragon[] = await response.json();

    // Ordenação alfabética exigida no desafio
    return data.sort((a, b) => {
      const nameA = (a.name || "").trim().toLowerCase();
      const nameB = (b.name || "").trim().toLowerCase();
      return nameA.localeCompare(nameB, "pt-BR");
    });
  },

  /**
   * Busca os detalhes de um dragão específico pelo ID
   */
  async getDragonById(id: string): Promise<Dragon> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Dragão não encontrado (ID: ${id})`);
    }

    return response.json();
  },

  /**
   * Cadastra um novo dragão
   */
  async createDragon(data: DragonFormData): Promise<Dragon> {
    const historiesArray = data.histories
      ? data.histories.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name: data.name.trim(),
      type: data.type.trim(),
      histories: historiesArray,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Não foi possível cadastrar o dragão.");
    }

    return response.json();
  },

  /**
   * Atualiza os dados de um dragão existente
   */
  async updateDragon(id: string, data: DragonFormData): Promise<Dragon> {
    const historiesArray = data.histories
      ? data.histories.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name: data.name.trim(),
      type: data.type.trim(),
      histories: historiesArray,
    };

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Não foi possível atualizar o dragão.");
    }

    return response.json();
  },

  /**
   * Remove um dragão do catálogo
   */
  async deleteDragon(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Não foi possível remover o dragão.");
    }
  },
};
