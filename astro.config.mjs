// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://rodrigograssi.dev",
  output: "static",
  integrations: [sitemap()],
  // CSS pequeno: vai direto no HTML e não bloqueia a primeira pintura
  build: {
    inlineStylesheets: "always",
  },
});
