import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projetos = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/projetos" }),
  schema: z.object({
    nome: z.string(),
    slug: z.string(),
    subdominio: z.string().optional(),
    tagline: z.string(),
    descricao: z.string(),
    status: z.enum(["em-uso", "em-construcao", "engavetado"]),
    ordem: z.number().int(),
    link: z.string().optional(),
  }),
});

// Páginas avulsas com texto em Markdown, como "Por que paiol?"
const paginas = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/paginas" }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
  }),
});

const escritos = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/escritos" }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    data: z.coerce.date(),
    rascunho: z.boolean().default(true),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { projetos, paginas, escritos };
