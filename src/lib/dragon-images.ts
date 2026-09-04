import type { Dragon } from "@/types/dragon";

const DRAGON_PRESET_MAP: Record<string, string> = {
  draco: "/images/dragons/Draco.webp",
  fafnir: "/images/dragons/Fafnir.webp",
  "furia da noite": "/images/dragons/Fúria da Noite.webp",
  furia: "/images/dragons/Fúria da Noite.webp",
  noite: "/images/dragons/Fúria da Noite.webp",
  glaurung: "/images/dragons/Glaurung.webp",
  harry: "/images/dragons/Harry.webp",
  sarai: "/images/dragons/Sarai.webp",
  smaug: "/images/dragons/Smaug.webp",
  tiamati: "/images/dragons/Tiamati.webp",
  tiamat: "/images/dragons/Tiamat.webp",
  wley: "/images/dragons/Wley.webp",
};

const FALLBACK_IMAGES = [
  "/images/login-hero.webp",
  "/images/dragons-flight.webp",
  "/images/detail-bg.webp",
  "/images/dashboard-bg.webp",
];

/**
 * Retorna a imagem específica do dragão com base no seu nome ou imagem anexada.
 * Suporta normalização de acentos e possíveis inconsistências de charset da API.
 */
export function resolveDragonImage(
  dragon: Dragon | undefined | null,
  fallbackIndex = 0
): string {
  if (!dragon) return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];

  // 1. Se o dragão tiver imagem customizada anexada via upload
  if (dragon.imageUrl) {
    return dragon.imageUrl;
  }

  // 2. Se tiver nome, tenta encontrar a arte específica na pasta dragons
  if (dragon.name) {
    const raw = dragon.name.toLowerCase().trim();
    // Normalizar removendo acentuação
    const normalized = raw
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "");

    // Busca exata
    if (DRAGON_PRESET_MAP[normalized]) {
      return DRAGON_PRESET_MAP[normalized];
    }

    // Busca exata no raw
    if (DRAGON_PRESET_MAP[raw]) {
      return DRAGON_PRESET_MAP[raw];
    }

    // Busca por substring (ex: "furia", "noite", "tiamati")
    for (const [key, path] of Object.entries(DRAGON_PRESET_MAP)) {
      if (normalized.includes(key) || raw.includes(key)) {
        return path;
      }
    }
  }

  // 3. Fallback rotativo
  return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
}
