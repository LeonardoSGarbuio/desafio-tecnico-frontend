export interface Dragon {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  histories?: string[] | string;
}

export interface DragonFormData {
  name: string;
  type: string;
  histories?: string;
}

export type DragonElement =
  | "Fogo"
  | "Gelo"
  | "Tempestade"
  | "Terra"
  | "Luz"
  | "Trevas"
  | "Arcano"
  | "Espiritual"
  | "Elemental"
  | "Outro";
