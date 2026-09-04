import test, { describe } from "node:test";
import assert from "node:assert/strict";

function cleanDragonList(raw) {
  const seen = new Set();
  return raw
    .filter((d) => {
      const name = (d.name || "").trim();
      if (name.length < 3) return false;
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => (a.name || "").localeCompare(b.name || "", "pt-BR"));
}

function formatBrazilianDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data não informada";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return "Data não informada";
  }
}

describe("Regras de Negócio - Dragon Sanctuary", () => {
  test("1. Ordenação alfabética estrita (A-Z) em PT-BR com acentos", () => {
    const sample = [
      { id: "1", name: "Smaug", type: "Fogo", createdAt: "" },
      { id: "2", name: "Álvaro", type: "Gelo", createdAt: "" },
      { id: "3", name: "Draco", type: "Fogo", createdAt: "" },
      { id: "4", name: "Fúria da Noite", type: "Trevas", createdAt: "" },
    ];

    const result = cleanDragonList(sample);
    const names = result.map((d) => d.name);

    assert.deepEqual(names, ["Álvaro", "Draco", "Fúria da Noite", "Smaug"]);
  });

  test("2. Higienização: descarta lixo da API (nomes com menos de 3 caracteres)", () => {
    const sample = [
      { id: "1", name: "a", type: "Teste", createdAt: "" },
      { id: "2", name: "dd", type: "Teste", createdAt: "" },
      { id: "3", name: "   ", type: "Teste", createdAt: "" },
      { id: "4", name: "Fafnir", type: "Veneno", createdAt: "" },
    ];

    const result = cleanDragonList(sample);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "Fafnir");
  });

  test("3. Deduplicação: remove registros repetidos com mesmo nome", () => {
    const sample = [
      { id: "1", name: "Fafnir", type: "Veneno", createdAt: "" },
      { id: "2", name: "FAFNIR", type: "Veneno", createdAt: "" },
      { id: "3", name: "fafnir", type: "Veneno", createdAt: "" },
      { id: "4", name: "Tiamat", type: "Caos", createdAt: "" },
    ];

    const result = cleanDragonList(sample);
    assert.equal(result.length, 2);
    assert.equal(result[0].name, "Fafnir");
    assert.equal(result[1].name, "Tiamat");
  });

  test("4. Formatação de data em padrão brasileiro (dd/MM/yyyy)", () => {
    const isoDate = "2026-03-01T14:30:00.000Z";
    const formatted = formatBrazilianDate(isoDate);
    assert.match(formatted, /\d{2}\/\d{2}\/\d{4}/);
  });
});
