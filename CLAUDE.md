# rodrigograssi.dev — Documento de passagem

Este arquivo descreve o site pessoal do Rodrigo Grassi. Todas as decisões de conteúdo, identidade e design abaixo já foram tomadas e aprovadas; o trabalho aqui é **construir**, não redesenhar. Em caso de dúvida sobre algo não coberto, pergunte antes de inventar.

---

## 1. O que é o site

Site de apresentação pessoal em `rodrigograssi.dev`. Três funções:

1. Apresentar o Rodrigo: desenvolvedor .NET e administrador de redes e servidores.
2. Servir de vitrine para os projetos pessoais, reunidos sob o conceito **"o paiol"**, cada um com nome caipira e subdomínio próprio.
3. Publicar textos técnicos na seção **"Anotações de oficina"**.

Idioma: português do Brasil (`lang="pt-BR"`). Tema: **somente escuro**.

---

## 2. Decisões técnicas

- **Framework:** Astro (versão estável mais recente), saída **estática**.
- **CSS:** CSS puro com variáveis (tokens da seção 3), escopo por componente (`<style>` do Astro). Sem Tailwind.
- **JavaScript no cliente:** o mínimo possível. O único comportamento interativo previsto é o menu mobile; prefira `<details>`/`<summary>` ou um script inline pequeno.
- **Fontes:** self-hosted via Fontsource (`@fontsource-variable/plus-jakarta-sans` e `@fontsource/jetbrains-mono`). Não carregar do Google Fonts.
- **Imagens:** usar `astro:assets` (`<Image />`) para gerar formatos modernos e tamanhos responsivos.
- **Conteúdo:** Content Collections com Markdown (`projetos` e `escritos`), schemas validados com Zod.
- **Integrações:** `@astrojs/sitemap` e `@astrojs/rss`.
- **HTTPS:** o TLD `.dev` está na lista de pré-carregamento HSTS; o site **só funciona com HTTPS**. Não há fase de teste em HTTP em produção.
- **Deploy:** container Nginx (`nginx-unprivileged`, porta 8080) no Docker Swarm do Rodrigo, atrás do Traefik que já existe no cluster; a imagem vai para um registry (GHCR ou Docker Hub). Arquivos: `Dockerfile` na raiz e a pasta `deploy/`; passo a passo em `deploy/LEIAME.md`. O build continua gerando um `dist/` estático.

---

## 3. Design tokens

Defina em `src/styles/tokens.css` e importe no layout base.

```css
:root {
  color-scheme: dark;

  /* Base */
  --bg: #0B0B0C;            /* fundo da página */
  --surface: #18181B;       /* cards e blocos */
  --surface-2: #27272A;     /* pílulas de status, divisórias */
  --border-dashed: #3F3F46; /* card engavetado */

  /* Texto sobre fundo escuro */
  --text: #F5F5F7;
  --text-2: #D4D4D8;        /* parágrafos de destaque */
  --muted: #A1A1AA;         /* textos secundários */

  /* Acento */
  --roxo: #7A1FD6;          /* blocos sólidos: topo e rodapé */
  --lilas: #C29BF7;         /* rótulos de seção e links sobre fundo escuro */
  --lilas-hover: #D9C2FB;

  /* Sobre o roxo */
  --on-roxo: #FFFFFF;
  --on-roxo-soft: #F3EAFF;  /* parágrafos sobre roxo */
  --on-roxo-label: #EDE0FF; /* rótulos mono sobre roxo */
  --roxo-divider: #A868F0;
  --btn-on-roxo-text: #2A0A4F;

  /* Tipografia */
  --font-sans: "Plus Jakarta Sans Variable", "Segoe UI", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Raios */
  --radius-card: 32px;      /* mobile: 26px */
  --radius-tile: 24px;      /* mobile: 22px */
  --radius-photo: 32px;     /* fotos do Sobre: 20px */
  --radius-pill: 999px;

  /* Layout */
  --content-max: 1200px;
  --gutter: 120px;          /* padding lateral desktop; mobile: 20px */
}
```

### Tipografia

| Elemento | Desktop | Mobile | Peso / detalhes |
|---|---|---|---|
| H1 (topo) | 84px / 1.02 | 42px / 1.04 | 800, letter-spacing -0.035em |
| H2 de seção | 48–56px / 1.05 | 34–36px | 800, letter-spacing -0.03em |
| H2 do rodapé | 64px | 38px | 800 |
| H3 de card | 36px | 28px | 800, letter-spacing -0.02em |
| Texto de destaque | 19–21px / 1.6–1.7 | 16–17px | 400 |
| Texto de card | 17px / 1.6 | 15px | 400, cor `--muted` |
| Rótulo de seção | 14px mono | 13px mono | ex.: `01 / sobre`, cor `--lilas` |
| Subdomínio no card | 13px mono | 12px mono | cor `--muted` |

### Padrões visuais

- **Blocos roxos sólidos** (`--roxo`) no **topo** (menu + apresentação) e no **rodapé de contato**, ocupando toda a largura. O meio da página é `--bg`.
- **Botões em pílula** (`--radius-pill`), altura 54–56px. Sobre roxo: primário branco com texto `--btn-on-roxo-text`; secundário com contorno branco de 1.5px.
- **Cards** em `--surface`, sem borda, cantos `--radius-card`. O card "engavetado" tem fundo transparente e borda tracejada `--border-dashed`.
- **Pílula de status** em `--surface-2`, texto `#E4E4E7`, 13px, peso 700.
- **Não usar:** gradientes, sombras chamativas, emoji, ícones de biblioteca pesada. Ícones são SVG inline de traço.
- **Logo:** um paiol desenhado em traço (SVG 36×36, `stroke="currentColor"`, `stroke-width="2"`, `stroke-linejoin="round"`):

```html
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
  <path d="M4 16 L18 5 L32 16"/><path d="M8 13 V31 H28 V13"/>
  <path d="M14 31 V21 H22 V31"/><path d="M14 21 L22 31 M22 21 L14 31"/>
</svg>
```
Ao lado: `rodrigograssi.dev` em `--font-mono`, 16px, peso 500.

- **Responsivo:** grids de 12 colunas no desktop viram coluna única no mobile. Alvos de toque com no mínimo 44px.

---

## 4. Estrutura de páginas

```
/                       Home
/paiol                  "Por que paiol?"
/projetos/[slug]        Página interna de cada projeto (layout pronto, conteúdo virá depois)
/escritos               Lista de "Anotações de oficina"
/escritos/[slug]        Post
/rss.xml                Feed dos escritos
/404                    Página de erro no mesmo visual
```

### Componentes sugeridos

`BaseLayout`, `Header` (com menu mobile), `Hero`, `SectionLabel`, `Sobre`, `SkillTile`, `Paiol`, `ProjectCard`, `Escritos`, `PostListItem`, `Footer`, `Seo` (meta tags + JSON-LD).

---

## 5. Home: seções e textos finais

Use os textos **exatamente** como estão abaixo.

### 5.1 Header (dentro do bloco roxo)
Logo à esquerda. Navegação à direita: **Sobre**, **O paiol**, **Escritos**, **Contato** (âncoras para as seções). No mobile, botão de menu com `aria-label="Abrir menu"`.

### 5.2 Topo (bloco roxo)
Grid de 12 colunas: texto em 8, foto em 4 (alinhada embaixo à direita). No mobile, só o texto (sem foto).

- Rótulo mono: `// desenvolvedor · infraestrutura`
- H1: **Desenvolvo sistemas e cuido da infraestrutura onde eles rodam.**
- Parágrafo: Sou Rodrigo Grassi, analista de sistemas e administrador de redes da FMVZ/UNESP, em Botucatu (SP). Desenvolvo sistemas, administro redes e servidores, e guardo aqui meus projetos pessoais e o que aprendo pelo caminho.
- Botões: **Ver projetos** (primário → `#paiol`) e **Contato** (secundário → `#contato`)
- Foto: `src/assets/fotos/rodrigo-topo.jpg`, 320×400, `object-fit: cover`, cantos 32px, `alt="Rodrigo Grassi"`.

### 5.3 Sobre (`id="sobre"`)
Desktop: coluna esquerda (4 colunas) com rótulo, título e fotos; coluna direita (colunas 6 a 12) com textos e competências.

- Rótulo: `01 / sobre`
- H2: **Do código à infraestrutura.**
- Fotos lado a lado (grid de 2, altura 260px desktop / 220px mobile, cantos 20px):
  - `src/assets/fotos/rodrigo-thais.jpg`, `alt="Rodrigo e Thaís à mesa de um café"`, `object-position: 68% 40%`
  - `src/assets/fotos/rodrigo-moira.jpg`, `alt="Rodrigo com a cachorra Moira"`, `object-position: 45% 55%`
- Legenda (14px, `--muted`): Com a Thaís, minha parceira de vida, e com a Moira, minha cãopanheira.
- Parágrafo 1: Gosto de tecnologia sem fanatismo: uso a ferramenta que resolve o problema, não a que está na moda. No dia a dia, escrevo sistemas, cuido de bancos de dados e administro a rede e os servidores que colocam tudo no ar. E sou movido a aprender coisa nova, o que explica metade dos projetos guardados aqui.
- Parágrafo 2: Fora da tela, levo uma vida simples: família, saúde, esporte e tempo na cozinha. E sempre tem algum projeto na bancada: eletrônica, impressão 3D ou o que aparecer.
- Parágrafo 3: Em 2026, recebi da diretoria da FMVZ um certificado de reconhecimento pela excelência no trabalho, a partir de um elogio registrado na Ouvidoria.
- Seis blocos de competência (grid de 3 colunas no desktop, empilhados no mobile), em `--surface`, cantos 24px:

| Título | Texto |
|---|---|
| Desenvolvimento | C# / .NET, Blazor, DDD, CQRS, Clean Architecture. Um pé em Python e Go. |
| Dados | SQL Server, PostgreSQL, MySQL e um pouco de MongoDB. |
| IA aplicada | Agentes, RAG e integração de LLMs em sistemas reais. MBA em desenvolvimento com IA em andamento. |
| Automação | Fluxos no n8n integrando Baserow, Metabase, Mautic, Chatwoot e Amazon SES. |
| Infraestrutura | Endereçamento IP, VLANs, VXLAN, Zabbix, WireGuard. Linux, Windows Server, DNS, DHCP, e-mail, Docker Swarm. |
| Oficina | Arduino, ESP32, PlatformIO, MQTT e impressão 3D. |

### 5.4 O paiol (`id="paiol"`)
- Rótulo: `02 / o paiol`
- H2: **O paiol**
- Texto: No interior, paiol é o depósito onde se guarda a colheita, o milho e as ferramentas. Foi o nome que dei ao lugar onde guardo meus projetos pessoais: alguns em uso, outros em construção, outros esperando a vez.
- Link: **Por que paiol? →** para `/paiol`
- Grid de 2 colunas (1 no mobile) com os cards gerados da coleção `projetos` (seção 6), ordenados pelo campo `ordem`. Projetos com `status: engavetado` vão por último, no estilo tracejado, com o rótulo "no fundo do paiol" no lugar do subdomínio e sem link.

### 5.5 Anotações de oficina (`id="escritos"`)
- Rótulo: `03 / escritos`
- H2: **Anotações de oficina**
- Texto: O que aprendo resolvendo problemas reais de infraestrutura, .NET e o que mais aparecer.
- Lista dos 3 posts mais recentes (título à esquerda, data em mono à direita; no mobile, data acima do título) e o link **Todos os escritos →**.
- **Enquanto não houver post publicado, a seção inteira não é renderizada** (nem o item "Escritos" do menu). O primeiro post está sendo escrito.

### 5.6 Contato / rodapé (`id="contato"`, bloco roxo)
- H2: **Vamos conversar?**
- Texto: Para falar de projetos, trabalho ou só trocar uma ideia.
- Botão pílula branco com o e-mail (`mailto:`), lido de `src/config.ts`.
- Linha inferior: `© Rodrigo Grassi · feito com Astro` (mono, `--on-roxo-label`) e links sociais.
- Links sociais vêm de `src/config.ts`; **renderize apenas os que estiverem preenchidos**. No lançamento, provavelmente só o LinkedIn. O RSS aparece só quando houver post.

```ts
// src/config.ts
export const site = {
  email: "",      // pendente
  linkedin: "",   // pendente, entra quando o perfil estiver preenchido
  github: "",     // pendente, entra quando o repositório do site for público
};
```

---

## 6. Coleção `projetos`

Um arquivo Markdown por projeto em `src/content/projetos/`. Schema:

```ts
{
  nome: string,           // "Caderneta"
  slug: string,
  subdominio?: string,    // "caderneta.rodrigograssi.dev"
  tagline: string,
  descricao: string,
  status: "em-uso" | "em-construcao" | "engavetado",
  ordem: number,
  link?: string,          // texto do link do card
}
```

Rótulos das pílulas: `em-uso` → "Em uso", `em-construcao` → "Em construção", `engavetado` → "Engavetado". **Os status reais ainda não foram definidos pelo Rodrigo**; use `em-construcao` como padrão (exceto o Rastro) e deixe um comentário `// TODO status` em cada arquivo.

No card, a descrição exibida é `tagline + " " + descricao`.

| ordem | nome | subdomínio | tagline | descrição | link |
|---|---|---|---|---|---|
| 1 | Caderneta | caderneta.rodrigograssi.dev | As contas da casa, anotadas como sempre foram. | Controle financeiro pessoal, simples e direto. | Conhecer a Caderneta → |
| 2 | Embornal | embornal.rodrigograssi.dev | O zelo de quem cuida, num lugar só. | Remédios, exames e o que o médico disse, organizados para a família levar à consulta. | Conhecer o Embornal → |
| 3 | Lamparina | lamparina.rodrigograssi.dev | Pra aprender no seu tempo, depois da lida. | Plataforma de cursos com aulas em vídeo, venda e acompanhamento do progresso do aluno. | Conhecer a Lamparina → |
| 4 | Alambique | alambique.rodrigograssi.dev | O conhecimento destilado em novos conteúdos. | Agentes de IA que transformam anos de experiência em tênis em scripts para vídeos, posts e textos, com um agente que pensa como o público. | Conhecer o Alambique → |
| 5 | Prumo | prumo.rodrigograssi.dev | Onde você está e o quanto falta para o ideal. | Entrevista de diagnóstico com notas de 0 a 10 por grupos de perguntas e um gráfico que compara o ideal com a realidade. Nasceu no tênis e serve para qualquer nicho. | Conhecer o Prumo → |
| 6 | Rastro | — | Links curtos com gestão de UTMs, para saber de onde veio cada visita. | Parado por enquanto. | — (status `engavetado`) |

O link do card aponta para `/projetos/[slug]`. O corpo Markdown de cada projeto fica vazio por enquanto; a página interna deve renderizar nome, tagline, descrição e status, com o corpo abaixo quando existir. Estrutura prevista para o corpo (não escrever o conteúdo): **A origem**, **O que faz**, **Como funciona por dentro**, **Stack**, **Status**.

---

## 7. Coleção `escritos`

`src/content/escritos/`. Schema: `titulo`, `descricao`, `data` (Date), `rascunho` (boolean, padrão `true`), `tags?`. Posts com `rascunho: true` não aparecem no build de produção. Crie **um único post de exemplo** com `rascunho: true` para validar o layout.

---

## 8. Página `/paiol`: "Por que paiol?"

Layout de artigo (coluna de leitura de ~680px), mesmo header e rodapé.

> ## Por que paiol?
>
> Paiol é aquele depósito que fica perto da casa, no sítio ou na fazenda, onde se guarda o que foi colhido: o milho, o feijão, as ferramentas, as coisas que ainda vão ter serventia. Não é vitrine. É onde fica o que foi feito com trabalho e o que ainda vai ser usado.
>
> Sou do interior, e quando precisei de um nome para o lugar onde guardo meus projetos pessoais, não quis nada com cara de "lab" ou "studio". Quis uma palavra que dissesse de onde eu venho e como gosto de trabalhar: sem pressa, sem firula, construindo coisa que serve.
>
> Os nomes dos projetos seguem a mesma lógica. Cada um é um objeto que qualquer pessoa do interior reconhece e que explica, do seu jeito, o que o projeto faz:
>
> - **Caderneta**, como a do armazém, onde se anotava cada conta. Aqui, as finanças da casa.
> - **Embornal**, a bolsa de pano onde se leva o necessário. Aqui, a saúde da família, pronta para a consulta.
> - **Lamparina**, a luz para estudar depois da lida. Aqui, cursos para aprender no próprio tempo.
> - **Alambique**, onde a matéria-prima vira essência. Aqui, o conhecimento destilado em novos conteúdos.
> - **Prumo**, o fio com peso que mostra se a parede está reta. Aqui, o quanto se está longe do ideal.
> - **Rastro**, a marca que fica no chão e mostra por onde alguém passou. Aqui, links curtos que revelam de onde veio cada visita.
>
> Nem tudo aqui está pronto. Paiol tem de tudo: o que já está em uso, o que ainda está sendo construído e o que ficou no canto esperando a vez. É assim mesmo.

Guarde esse texto em um arquivo Markdown (`src/content/paginas/paiol.md` ou equivalente), não direto no componente, porque o Rodrigo ainda pode acrescentar um parágrafo pessoal.

---

## 9. SEO

- `<title>` e `meta description` por página. Home: título "Rodrigo Grassi — desenvolvedor e infraestrutura"; descrição baseada no parágrafo do topo.
- Open Graph e Twitter Card em todas as páginas (imagem OG padrão: gerar uma 1200×630 simples no visual do site, com logo, nome e o roxo; pode ser um PNG estático em `public/`).
- `link rel="canonical"` com `site: "https://rodrigograssi.dev"` no `astro.config`.
- JSON-LD `Person` na home: nome, `jobTitle`, `url`, `sameAs` (somente links preenchidos em `config.ts`).
- `@astrojs/sitemap` e `public/robots.txt` apontando para o sitemap.
- Favicon a partir do SVG do logo.

---

## 10. Acessibilidade e performance

- HTML semântico (`header`, `nav`, `main`, `section`, `article`, `footer`), um único `h1` por página.
- Contraste mínimo 4.5:1 no texto normal. Os tokens acima já foram escolhidos para isso; não clarear `--muted` sobre `--surface`.
- Links e botões reais (`<a>`, `<button>`), foco visível (outline em `--lilas`).
- `scroll-behavior: smooth` respeitando `prefers-reduced-motion`.
- Meta: Lighthouse ≥ 95 em todas as categorias.

---

## 11. Fotos

Coloque em `src/assets/fotos/` (os arquivos serão fornecidos pelo Rodrigo):

| Arquivo | Uso |
|---|---|
| `rodrigo-topo.jpg` | Foto do topo (recorte vertical) |
| `rodrigo-thais.jpg` | Sobre, esquerda |
| `rodrigo-moira.jpg` | Sobre, direita |

A foto do topo é provisória e será trocada depois; não dependa das proporções dela além de 4:5.

---

## 12. Ordem de execução

Trabalhe em etapas pequenas. Ao fim de cada uma, rode `npm run build` sem erros, mostre o resultado e **espere aprovação** antes de seguir.

1. Criar o projeto Astro, instalar dependências, configurar `site`, sitemap, fontes e `tokens.css`. Layout base com header e rodapé.
2. Topo e Sobre, com as fotos.
3. Coleção `projetos` + seção O paiol + cards.
4. Página `/paiol`.
5. Páginas internas `/projetos/[slug]` (layout).
6. Coleção `escritos`, seção condicional na home, `/escritos`, `/escritos/[slug]` e RSS.
7. SEO completo, JSON-LD, imagem OG, favicon, `robots.txt`, 404.
8. Revisão de responsividade (390px, 768px, 1440px), acessibilidade e Lighthouse.

---

## 13. Pendências (não resolver sozinho)

- Status real de cada projeto.
- LinkedIn e GitHub em `config.ts` (o e-mail já está: `contato@rodrigograssi.dev`, via Cloudflare Email Routing).
- Foto definitiva do topo.
- Conteúdo das páginas internas dos projetos.
