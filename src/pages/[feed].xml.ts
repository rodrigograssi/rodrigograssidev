import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { obterEscritos } from "../lib/escritos";

// Rota com parâmetro para que /rss.xml só seja gerado quando houver escrito publicado
export async function getStaticPaths() {
  const escritos = await obterEscritos();
  return escritos.length > 0 ? [{ params: { feed: "rss" } }] : [];
}

export async function GET(context: APIContext) {
  const escritos = await obterEscritos();

  return rss({
    title: "Anotações de oficina — Rodrigo Grassi",
    description: "O que aprendo resolvendo problemas reais de infraestrutura, .NET e o que mais aparecer.",
    site: context.site!,
    items: escritos.map((escrito) => ({
      title: escrito.data.titulo,
      description: escrito.data.descricao,
      pubDate: escrito.data.data,
      link: `/escritos/${escrito.id}/`,
      categories: escrito.data.tags,
    })),
    customData: "<language>pt-br</language>",
  });
}
