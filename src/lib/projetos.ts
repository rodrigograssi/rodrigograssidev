import { getCollection, type CollectionEntry } from "astro:content";

export type Projeto = CollectionEntry<"projetos">;
export type StatusProjeto = Projeto["data"]["status"];

export const rotulosStatus: Record<StatusProjeto, string> = {
  "em-uso": "Em uso",
  "em-construcao": "Em construção",
  "em-homologacao": "Em Homologação",
  engavetado: "Engavetado",
};

/** Projetos ordenados pelo campo `ordem`, com os engavetados sempre por último. */
export async function obterProjetosOrdenados(): Promise<Projeto[]> {
  const projetos = await getCollection("projetos");

  return projetos.sort((a, b) => {
    const aEngavetado = a.data.status === "engavetado" ? 1 : 0;
    const bEngavetado = b.data.status === "engavetado" ? 1 : 0;
    return aEngavetado - bEngavetado || a.data.ordem - b.data.ordem;
  });
}
