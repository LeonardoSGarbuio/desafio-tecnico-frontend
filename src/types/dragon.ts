/** Tipo de um dragão retornado pela MockAPI */
export interface Dragon {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  histories?: string[] | string;
  imageUrl?: string;
}
