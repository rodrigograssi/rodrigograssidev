import { getCollection, type CollectionEntry } from "astro:content";

export type Escrito = CollectionEntry<"escritos">;

/**
 * Escritos visíveis, do mais recente para o mais antigo.
 * No build de produção os rascunhos ficam de fora; no `npm run dev` aparecem, para validar o layout.
 */
export async function obterEscritos(): Promise<Escrito[]> {
  const escritos = await getCollection("escritos", ({ data }) => !import.meta.env.PROD || !data.rascunho);
  return escritos.sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
}

const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Data no formato "27 set 2026". As datas do frontmatter chegam em UTC. */
export function formatarData(data: Date): string {
  const dia = String(data.getUTCDate()).padStart(2, "0");
  return `${dia} ${meses[data.getUTCMonth()]} ${data.getUTCFullYear()}`;
}

/** Data em ISO (AAAA-MM-DD) para o atributo datetime de <time>. */
export function dataIso(data: Date): string {
  return data.toISOString().slice(0, 10);
}
