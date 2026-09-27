# Deploy do rodrigograssi.dev

O site roda no Docker Swarm, atrás do Traefik que já existe no cluster.

```
navegador ──HTTPS──> Traefik (certificado) ──HTTP :8080──> site (Nginx, 2 réplicas)
```

## Arquivos

| Arquivo | Para quê |
|---|---|
| `Dockerfile` (raiz) | Build do Astro em `node:24-alpine`; serve o `dist/` com `nginx-unprivileged` (sem root, porta 8080) |
| `deploy/nginx.conf` | Rotas, 404, gzip, cache e `/saude` para o healthcheck |
| `deploy/cabecalhos-seguranca.conf` | HSTS, CSP e demais cabeçalhos de segurança |
| `deploy/docker-stack.yml` | Serviço no Swarm com as labels do Traefik |
| `deploy/.env.exemplo` | Variáveis do deploy (imagem, rede, entrypoint e certresolver do Traefik) |

## Antes do primeiro deploy

1. **DNS na Cloudflare:** registro `A` de `rodrigograssi.dev` apontando para o IP da VM.
   Se o registro ficar com proxy (nuvem laranja), use SSL **Full (strict)** na Cloudflare
   e confirme que o certresolver do Traefik consegue emitir o certificado assim.
2. **Variáveis:** na VM (nó manager), copie `deploy/.env.exemplo` para `deploy/.env` e ajuste:
   - `IMAGEM`: nome completo da imagem no registry;
   - `TRAEFIK_REDE`: rede overlay onde o Traefik está (`docker network ls`);
   - `TRAEFIK_ENTRYPOINT` e `TRAEFIK_CERTRESOLVER`: os nomes usados na configuração do Traefik.
3. Se o seu Traefik usa `constraints` para filtrar serviços, acrescente a label correspondente no `docker-stack.yml`.

## Publicar uma versão

Na máquina de desenvolvimento (a VM é linux/amd64):

```sh
# login no registry (uma vez); no GHCR a senha é um token com permissão write:packages
docker login ghcr.io

# build e envio; use uma tag por versão, além de latest
docker buildx build --platform linux/amd64 \
  -t ghcr.io/SEU-USUARIO/rodrigograssidev:2026-09-27 \
  -t ghcr.io/SEU-USUARIO/rodrigograssidev:latest \
  --push .
```

No nó manager do Swarm, com `deploy/docker-stack.yml` e `deploy/.env` copiados:

```sh
cd deploy
set -a; . ./.env; set +a
docker stack deploy -c docker-stack.yml --with-registry-auth rodrigograssi
```

O `--with-registry-auth` repassa o login do registry para os nós; é necessário se a imagem for privada.

A atualização é sem queda: sobe uma réplica nova, espera o healthcheck e só então derruba a antiga
(`order: start-first`). Se a nova falhar, o Swarm volta para a versão anterior sozinho.

## Conferir

```sh
docker service ps rodrigograssi_site     # réplicas rodando
docker service logs -f rodrigograssi_site
curl -sI https://rodrigograssi.dev       # 200 com Strict-Transport-Security
```

## Voltar para a versão anterior

```sh
docker service rollback rodrigograssi_site
```

## Testar a imagem localmente

```sh
docker build -t rodrigograssidev:teste .
docker run --rm -p 8089:8080 rodrigograssidev:teste
# http://localhost:8089
```
