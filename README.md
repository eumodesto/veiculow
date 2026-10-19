# Veiculow

Plataforma de gestão de veículos, site público e publicação multicanal para a Ponto Auto Veículos.

## Base do produto

- Next.js e TypeScript para site e painel.
- NestJS para API e workers.
- Supabase para PostgreSQL, Auth, Storage e Queues.
- Cloudflare para domínio, DNS, CDN e proteção.
- Instagram profissional para publicação de carrosséis.

## Documentação

- [MVP aprovado](docs/MVP-ESCOPO-APROVADO.md)
- [Arquitetura do sistema](docs/ARQUITETURA-SISTEMA.md)
- [Recomendações da homepage](docs/RECOMENDACOES-DESIGN-SYSTEM-HOMEPAGE.md)

## Configuração

Copie `.env.example` para `.env.local` no ambiente de desenvolvimento e preencha os secrets localmente. Nunca envie `.env.local`, senhas, service role keys ou tokens para o repositório.

## Deploy

O projeto será conectado à Vercel após a criação da aplicação Next.js. O domínio continuará sendo administrado pela Cloudflare.
