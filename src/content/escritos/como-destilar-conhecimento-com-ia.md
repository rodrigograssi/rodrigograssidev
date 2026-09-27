---
titulo: "Como destilar o conhecimento de uma especialista com IA"
descricao: "O Alambique por dentro: pipeline, RAG e um agente que pensa como o público."
data: 2026-09-27
rascunho: false
tags: ["ia", "rag", "agentes", "alambique"]
---

<!--
  PENDÊNCIAS (procure por "[A CONFIRMAR" no texto):
  1. Modelo de embeddings usado no Ollama
  2. Modelos dos agentes no OpenRouter
  3. Como o Whisper roda localmente (whisper.cpp, faster-whisper, outro?)
  4. Como funciona a anonimização
  5. Se o material bruto do público nunca sai da máquina
  6. Seções "O que funcionou e o que não funcionou" e "Próximos passos"
  Quando tudo estiver preenchido, mude "rascunho" para false.
-->

A Thaís é treinadora de tênis e tem anos de conhecimento espalhados em vídeos, cursos e posts. O problema de quem vive de conteúdo não é saber o que dizer. É transformar o que já sabe em algo novo toda semana, sem perder a própria voz.

Ferramentas genéricas de IA escrevem rápido, mas escrevem como qualquer um. Peça um roteiro sobre backhand e você recebe um texto correto, genérico e sem alma, que poderia ter saído de qualquer blog. Eu queria o contrário: uma IA que soubesse só o que ela sabe, e que falasse com o público dela como ela fala.

## Por que "Alambique"

No alambique, a matéria-prima entra bruta e sai transformada em essência. Não se inventa nada no caminho: o que sai é o que já estava lá dentro, só que concentrado.

Foi essa a ideia do projeto. A matéria-prima são os vídeos, os cursos e os posts que a Thaís já produziu. O alambique é o conjunto de pipeline, base de conhecimento e agentes que processa esse material. E o que sai são conteúdos novos, com o conhecimento dela, na voz dela, pensados para quem vai ler ou assistir.

A regra que guiou tudo: **a IA não é a especialista, é o destilador.** Se a informação não está no material da Thaís, ela não deveria aparecer no conteúdo.

## A matéria-prima: duas fontes, dois perfis

O Alambique trabalha com dois tipos de matéria-prima, e cada um alimenta um perfil diferente.

O **perfil da Thaís** é formado pelo que ela já produziu: vídeos e posts. É dali que vêm o conhecimento técnico e, tão importante quanto, o jeito dela de explicar, com suas expressões, seus exemplos e seu ritmo.

O **perfil do aluno** vem de duas fontes em que quem fala é o público: entrevistas com alunos e as transcrições das sessões do [Prumo](/projetos/prumo), o sistema de diagnóstico que a Thaís usa com quem quer entrar na mentoria. Ali está o que nenhum material de especialista mostra: as dores, os desejos e as objeções de quem está do outro lado da rede.

É aqui que dois projetos do paiol se encontram. O Prumo nasceu para diagnosticar um tenista; o Alambique aproveita essas conversas para entender o público como um todo.

Os vídeos passam pelo mesmo pipeline. Primeiro, a transcrição, feita com o Whisper rodando localmente [A CONFIRMAR: whisper.cpp, faster-whisper ou outro]. Depois, a limpeza: saem as marcações de tempo e os vícios de linguagem, os "né", "tipo" e "então" que são naturais na fala e poluem o texto. O que sobra é o conhecimento em estado bruto, pronto para ser guardado.

## Privacidade antes de tudo

Entrevistas e sessões de diagnóstico são conversas em que as pessoas falam das próprias dificuldades. Esse material não pode virar conteúdo com o nome de ninguém.

Por isso, tudo o que vem do público passa por uma etapa de **anonimização** antes de chegar à base de conhecimento. [A CONFIRMAR: o que é removido (nomes, cidades, clubes, idades?), em que ponto do pipeline acontece e se é automático, com modelo local, ou revisado.] O agente do aluno nunca sabe quem disse o quê. Ele só enxerga padrões: que muita gente trava no backhand sob pressão, que a falta de tempo é a objeção mais comum.

E o processamento dessas conversas acontece localmente: as transcrições e a anonimização rodam na máquina, sem enviar o material bruto para serviços externos. [A CONFIRMAR]

## O reservatório: PostgreSQL com pgvector

Todo esse material vira embeddings, gerados localmente com o Ollama [A CONFIRMAR: modelo de embeddings], e fica guardado no PostgreSQL com a extensão pgvector.

A escolha foi pragmática: eu já trabalho com PostgreSQL, e o pgvector permite fazer busca semântica no mesmo banco onde ficam os outros dados, sem adicionar mais uma peça na infraestrutura. Quando um agente precisa falar sobre, por exemplo, a preparação do saque, ele não recebe tudo o que a Thaís já disse, só os trechos mais relevantes para aquele tema.

## A destilação: três agentes, três papéis

O Alambique tem três agentes, e o segredo está em cada um fazer uma coisa só.

**1. O agente do aluno** lê o material do público e extrai o que importa: do que as pessoas reclamam, o que querem alcançar e o que as impede de dar o próximo passo.

**2. O agente estrategista** é o marqueteiro da equipe. Ele pega essas dores, desejos e objeções e transforma em temas de conteúdo. É ele quem decide *sobre o que* vale falar esta semana.

**3. O agente da Thaís** recebe o tema e escreve com o conhecimento e o tom dela. Ele produz quatro formatos: dicas rápidas, posts de blog, roteiros de reels e roteiros de lives.

```
Vídeos e posts da Thaís ──► transcrição ─► limpeza ─► pgvector ──────────────┐
                                                                             ├─► Agente da Thaís ─► roteiros
Entrevistas e Prumo ──► transcrição ─► anonimização ─► Agente do aluno ─► Estrategista ─► temas ─┘
```

## Por que a Thaís não é marqueteira

A decisão de arquitetura mais importante do projeto foi esta: **o agente da Thaís não tem objetivo de marketing.** Ele só quer ensinar, como ela.

A estratégia fica no agente anterior, que escolhe os temas a partir das dores do público. Quando o tema chega à Thaís, já é algo que o público precisa ouvir, e ela só precisa fazer o que sabe: explicar bem.

Isso não significa que o conteúdo não venda. O agente da Thaís usa o que costuma se chamar de "vender sem vender", por dois caminhos:

- **Semeadura:** ao explicar um problema, mostra naturalmente como ele é tratado nos cursos dela, sem transformar a dica em anúncio.
- **Prova:** sempre que um aluno ou mentorado alcança um objetivo, isso vira conteúdo. Nenhum argumento de venda é mais forte que um resultado real.

Se o mesmo agente tivesse que ensinar e vender ao mesmo tempo, o texto acabaria soando como propaganda. Separando os papéis, cada um faz bem o seu.

## A stack

O sistema é orquestrado em .NET e roda em containers Docker numa máquina virtual. A transcrição e os embeddings rodam localmente, e os modelos de linguagem dos agentes são acessados pelo OpenRouter. Esse modelo híbrido mantém local o processamento pesado, repetitivo e sensível, e usa modelos maiores só onde a qualidade do texto faz diferença.

