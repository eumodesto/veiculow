# Plataforma de Gestão de Veículos e Publicação Multicanal

**Status:** Aprovado para início do desenvolvimento  
**Versão:** 1.1  
**Data:** 19 de outubro de 2026  
**Produto:** Sistema para uma loja/revenda de veículos

## Escopo aprovado para a primeira versão

Esta primeira versão atende uma única loja, sem filiais na interface ou no fluxo operacional.

Incluído no MVP:

- perfil e identidade da loja;
- usuários, funções e permissões;
- cadastro e gestão do estoque de veículos;
- fotos, galeria e armazenamento no Supabase Storage;
- site público responsivo;
- painel administrativo;
- geração automática de carrossel para Instagram;
- revisão e aprovação do carrossel;
- publicação direta em conta Instagram profissional;
- integração de contato via WhatsApp;
- histórico, auditoria e tratamento de erros;
- base para integrações com portais de veículos.

Fora do MVP:

- múltiplas filiais;
- aplicativo mobile nativo;
- marketplace próprio;
- financiamento com simulação integrada;
- automações baseadas em scraping;
- relatórios avançados de BI.

As funcionalidades fora do MVP poderão ser adicionadas em fases posteriores.

## 1. Objetivo

Construir uma plataforma para cadastrar o estoque de veículos uma única vez e distribuir essas informações para o site da loja, portais de anúncios, redes sociais e canais de atendimento.

O sistema deverá transformar um veículo publicado no site em um conteúdo visual pronto para Instagram, utilizando o mesmo Design System da aplicação. A geração do material deverá ser automática, rastreável e editável antes da publicação.

## 2. Princípios do produto

- O estoque central é a fonte oficial dos dados do veículo.
- Nenhuma integração externa deve alterar diretamente o cadastro principal.
- Cada portal ou canal social deve ser implementado por meio de um adaptador independente.
- Processamentos demorados devem ocorrer em segundo plano, por filas.
- Todas as alterações importantes devem possuir histórico e auditoria.
- A primeira versão será um monólito modular, preparado para separar workers quando houver escala.
- A primeira versão atende uma única loja, sem filiais.
- A estrutura deve permitir adicionar filiais em uma versão futura sem reescrever o domínio.

## 3. Stack aprovada

### Aplicação

- **Frontend:** Next.js com App Router e TypeScript.
- **Componentes visuais:** Tailwind CSS e biblioteca de componentes baseada no Design System próprio.
- **Backend:** NestJS e TypeScript.
- **API:** REST documentada com OpenAPI/Swagger.
- **Validação:** schemas compartilhados entre frontend e backend.

### Plataforma Supabase

- **Banco:** Supabase PostgreSQL.
- **Arquivos:** Supabase Storage.
- **Autenticação:** Supabase Auth.
- **Autorização:** Row Level Security (RLS) e permissões de aplicação.
- **Filas iniciais:** Supabase Queues/pgmq.

### Processamento e operação

- **Worker:** NestJS Worker separado do processo HTTP.
- **Geração de imagens:** React/HTML de template + Satori/Resvg ou equivalente + Sharp para otimização.
- **Deploy:** Next.js na Vercel; API e workers em serviço gerenciado compatível com Docker.
- **Monitoramento:** Sentry, logs estruturados e OpenTelemetry.
- **Testes:** Vitest/Jest para unidade e Playwright para fluxos críticos.

Redis + BullMQ poderá ser adicionado posteriormente para cenários de alto volume. Não é requisito da primeira versão.

## 4. Arquitetura de módulos

```text
apps/
  web/                 Site público e painel administrativo
  api/                 API NestJS
  worker/              Consumidores de filas e integrações

packages/
  design-system/       Tokens, componentes e templates visuais
  contracts/            Tipos, schemas e contratos de API
  vehicle-domain/       Regras compartilhadas do domínio de veículos
  social-renderer/      Renderização dos posts para redes sociais

supabase/
  migrations/           Migrações do banco e políticas RLS
  seed/                 Dados iniciais para desenvolvimento

docs/
  ARQUITETURA-SISTEMA.md
```

Módulos funcionais do backend:

- Perfil da loja.
- Usuários, funções e permissões.
- Veículos e características.
- Fotos e mídias.
- Publicação no site.
- Integrações com portais.
- Geração de conteúdo social.
- Leads e atendimento.
- Auditoria e observabilidade.

## 5. Fluxo principal do veículo

```text
Cadastro ou alteração do veículo
        ↓
Validação e salvamento no estoque central
        ↓
Publicação/atualização no site
        ↓
Evento vehicle.published
        ├── Geração do post visual
        ├── Publicação em portais autorizados
        └── Atualização de métricas e histórico
```

Cada ação deve gerar um registro de status, data, usuário responsável, tentativa, resposta externa e eventual mensagem de erro.

## 6. Modelo de dados inicial

Entidades principais:

- `companies`: empresa proprietária da conta, preparada para evolução futura.
- `users`: usuários vinculados às empresas.
- `roles` e `permissions`: controle de acesso.
- `vehicles`: estoque central dos veículos.
- `vehicle_images`: arquivos, ordem, tipo, tamanho e status de processamento.
- `vehicle_features`: opcionais e características.
- `publication_channels`: canais habilitados para a loja.
- `publication_jobs`: trabalhos de publicação e sincronização.
- `publication_results`: resposta de cada portal ou rede social.
- `social_templates`: templates de posts versionados.
- `social_posts`: post gerado, status, formato e vínculo com o veículo.
- `audit_logs`: trilha de auditoria.

Todos os registros de negócio devem conter `company_id`. O campo `branch_id` não faz parte do MVP e não deve aparecer na interface inicial.

## 7. Supabase Storage

Buckets recomendados:

```text
vehicle-originals
vehicle-optimized
vehicle-thumbnails
vehicle-documents
social-posts
company-assets
```

Padrão de caminho:

```text
{company_id}/{vehicle_id}/{uuid}.webp
```

Regras:

- O navegador não deve receber a chave secreta do Supabase.
- Uploads privados devem usar URL assinada ou token temporário.
- Imagens originais não devem ser sobrescritas; novas versões devem usar novos caminhos.
- Os arquivos publicados em redes sociais devem possuir registro em `social_posts`.
- Políticas RLS devem limitar o acesso à empresa proprietária da conta.

## 8. Design System compartilhado

O Design System será a fonte única de verdade para o painel, site e posts sociais.

### Tokens mínimos

- Cores de marca, fundo, texto, destaque e status.
- Tipografia e pesos.
- Espaçamentos.
- Raios de borda.
- Sombras.
- Grid e breakpoints.
- Ícones.
- Regras de contraste e legibilidade.

### Componentes reutilizáveis

- `VehicleCard`.
- `VehiclePrice`.
- `VehicleBadge`.
- `BrandLogo`.
- `DealerFooter`.
- `ContactBlock`.
- `Watermark`.
- `SocialPostFrame`.

Os templates de Instagram devem consumir os mesmos tokens e componentes sempre que possível, mas serão renderizados como imagem final para garantir consistência em qualquer rede social.

## 9. Geração automática do post para Instagram

### Gatilho

Quando o veículo for publicado ou quando o usuário selecionar “Criar post para Instagram”, o sistema criará um job `social_post.generate`.

O usuário deverá poder escolher entre:

- gerar automaticamente;
- revisar antes de publicar;
- publicar imediatamente, se houver integração autorizada;
- não gerar post para aquele veículo.

### Dados usados no post

- Foto principal ou foto selecionada.
- Marca e modelo.
- Versão.
- Ano/modelo.
- Quilometragem.
- Preço.
- Localização da loja.
- Telefone ou WhatsApp comercial.
- Logo da empresa.
- Texto opcional configurado pela loja.

O sistema nunca deve inventar informações do veículo. Campos ausentes devem ser ocultados ou sinalizados para revisão.

### Formato oficial: carrossel

Todo post de veículo para Instagram deverá ser criado como **carrossel**. Não haverá publicação automática de imagem única na primeira versão.

Formato padrão:

- **Quantidade padrão:** 5 cards.
- **Quantidade permitida:** de 3 a 10 cards, conforme as informações e fotos disponíveis.
- **Dimensão:** 1080 x 1350 pixels, formato vertical 4:5.
- **Formato do arquivo:** JPEG ou WebP otimizado.
- **Ordem fixa:** capa, informações principais, diferenciais, condições comerciais e contato.

O usuário poderá revisar a ordem e remover cards antes da aprovação, mas o resultado final deverá conter no mínimo 3 cards.

### Estrutura do carrossel inicial

```text
Card 1 — Capa
  Foto principal, logo, marca/modelo e chamada visual

Card 2 — Informações do veículo
  Versão, ano/modelo, quilometragem, câmbio e combustível

Card 3 — Destaques
  Opcionais, diferenciais e segunda foto do veículo

Card 4 — Oferta
  Preço, condições comerciais ou chamada para financiamento

Card 5 — Contato
  WhatsApp, telefone, localização, logo e chamada para ação
```

Cards sem dados suficientes poderão ser omitidos, desde que o carrossel permaneça com pelo menos 3 cards.

### Template inicial

```text
┌────────────────────────────┐
│ Card 1 — Capa               │
│ Logo da loja                │
│     Foto principal          │
│ MARCA MODELO                │
├────────────────────────────┤
│ Card 2 — Dados              │
│ Versão · Ano · Km           │
│ Câmbio · Combustível        │
├────────────────────────────┤
│ Card 3 — Destaques          │
│ Opcionais e diferenciais    │
│     Foto complementar       │
├────────────────────────────┤
│ Card 4 — Oferta             │
│ R$ 00.000,00                │
│ Condições comerciais        │
├────────────────────────────┤
│ Card 5 — Contato            │
│ WhatsApp | Cidade/UF        │
│ Chamada para ação           │
└────────────────────────────┘
```

O template deve possuir áreas seguras para evitar cortes em diferentes visualizações e deve manter contraste suficiente entre texto e imagem.

### Pipeline técnico

```text
VehiclePublishedEvent
        ↓
Selecionar template e dados
        ↓
Validar campos obrigatórios
        ↓
Baixar/obter imagem autorizada
        ↓
Montar sequência de cards do carrossel
        ↓
Renderizar cada card com o Design System
        ↓
Gerar PNG/JPEG/WebP
        ↓
Validar quantidade, dimensão e ordem dos cards
        ↓
Salvar imagens no bucket social-posts
        ↓
Criar preview e registrar checksum
        ↓
Aguardar aprovação ou publicar
```

Cada geração deve registrar `template_version`, `design_tokens_version`, quantidade e ordem dos cards, tamanho, formato, checksum e data. Isso permite reproduzir um carrossel antigo mesmo depois de uma alteração visual.

## 10. Publicação no Instagram

A primeira integração deverá utilizar a API oficial da Meta para contas profissionais autorizadas. O sistema não deve depender de automação de navegador ou scraping.

O cliente poderá publicar o carrossel diretamente pela área administrativa, sem precisar baixar a arte ou abrir o Instagram manualmente.

### Fluxo do administrador

```text
Painel do cliente
      ↓
Conectar Instagram profissional
      ↓
Selecionar veículo
      ↓
Gerar carrossel com o Design System
      ↓
Editar legenda, hashtags e ordem dos cards
      ↓
Visualizar prévia
      ↓
Publicar agora ou agendar
      ↓
Meta publica no Instagram
      ↓
Sistema salva ID, status e data da publicação
```

O botão de publicação deverá ficar disponível apenas quando:

- a conta profissional estiver conectada;
- o token estiver válido;
- o carrossel tiver de 3 a 10 cards;
- todos os cards estiverem no formato aprovado;
- o veículo ainda não tiver uma publicação equivalente ativa;
- a legenda tiver passado pela validação do sistema.

Se a publicação falhar, o usuário deverá visualizar o motivo, corrigir o problema e reprocessar o mesmo job sem criar duplicidade.

Requisitos funcionais:

- conectar uma conta profissional da loja;
- iniciar a conexão pelo painel usando OAuth da Meta;
- armazenar tokens de forma segura;
- validar permissões e expiração;
- criar o conteúdo a partir da mídia gerada;
- permitir editar a legenda, hashtags e chamada para ação;
- permitir publicar imediatamente pela área administrativa;
- permitir agendar a publicação, quando disponível para a conta e versão da API;
- publicar ou deixar como pendente de aprovação;
- registrar o identificador da publicação e a resposta da Meta;
- permitir reprocessamento sem duplicar publicação.

O módulo deve ser desenvolvido atrás de uma interface `SocialChannelAdapter`, permitindo adicionar Facebook, TikTok ou outros canais posteriormente.

```ts
interface SocialChannelAdapter {
  validateConnection(): Promise<ConnectionStatus>;
  createPost(input: SocialPostInput): Promise<ExternalPostResult>;
  deletePost(externalId: string): Promise<void>;
}
```

Para utilizar a publicação direta, o cliente deverá possuir uma conta Instagram profissional, Business ou Creator, e conceder ao sistema as permissões necessárias. Dependendo do fluxo de login adotado pela versão vigente da API, poderá ser necessário vincular a conta a uma Página do Facebook ou utilizar o login profissional próprio do Instagram.

As permissões, requisitos de conta, aprovação do aplicativo e detalhes da API da Meta devem ser validados no momento da implementação, pois podem variar conforme o tipo de conta e a versão da API.

## 11. Filas e idempotência

Jobs recomendados:

- `vehicle.image.process`.
- `social_post.generate`.
- `social_post.publish`.
- `portal.listing.publish`.
- `portal.listing.update`.
- `portal.listing.remove`.
- `lead.notification.send`.

Cada job deve possuir:

- `job_id` único;
- chave de idempotência;
- número máximo de tentativas;
- backoff;
- timeout;
- status `pending`, `processing`, `succeeded`, `failed` ou `cancelled`;
- mensagem de erro segura para diagnóstico.

## 12. Segurança e LGPD

- Separação obrigatória por empresa.
- RLS em tabelas e Storage.
- Tokens externos criptografados ou protegidos por secret manager.
- Nunca registrar tokens em logs.
- Controle de acesso por função.
- Auditoria de alterações e publicações.
- Política de retenção para documentos e leads.
- Consentimento e finalidade para dados de contato.
- Rate limiting na API pública.
- Validação de tipo e tamanho de arquivos.

## 13. Roadmap recomendado

### Fase 1 — Base do produto

- Autenticação e empresas.
- Cadastro de veículos.
- Upload de fotos.
- Site público.
- Painel de estoque.
- Design System inicial.

### Fase 2 — Conteúdo social

- Template de Instagram.
- Geração automática do post.
- Preview e aprovação.
- Histórico de versões.
- Download manual da arte.

### Fase 3 — Publicação integrada

- Conexão com Instagram profissional.
- Publicação automática.
- Logs e reprocessamento.
- Métricas básicas.

### Fase 4 — Multicanal

- Adaptadores para portais.
- Sincronização de estoque.
- Leads centralizados.
- WhatsApp.
- Relatórios de desempenho.

## 14. Critérios de aceite da primeira versão social

- Um veículo publicado no site pode gerar um carrossel com um clique.
- A arte usa os mesmos tokens visuais do sistema.
- O usuário consegue visualizar todos os cards antes da publicação.
- O carrossel possui entre 3 e 10 cards, com 5 cards como padrão.
- Todos os cards possuem a dimensão vertical 1080 x 1350.
- A ordem do carrossel segue a estrutura definida ou uma ordem revisada pelo usuário.
- O usuário pode trocar a foto principal.
- O cliente consegue conectar uma conta Instagram profissional pelo painel.
- O cliente consegue publicar o carrossel diretamente pela área administrativa.
- O sistema registra o status, identificador externo e data da publicação.
- Campos ausentes não são inventados.
- A arte é salva no Supabase Storage.
- O sistema mantém histórico de gerações.
- Falhas de geração podem ser reprocessadas.
- A publicação externa nunca bloqueia o cadastro do veículo.
- O sistema impede duplicação acidental do mesmo post.

## 15. Decisão arquitetural consolidada

```text
Next.js + NestJS + Supabase
        ↓
PostgreSQL + RLS + Storage + Auth + Queues
        ↓
Design System compartilhado
        ↓
Geração versionada de artes sociais
        ↓
Adaptadores para Instagram e portais de veículos
```

Esta é a base oficial para iniciar o desenvolvimento. A implementação deve preservar o estoque central, a separação por empresa e a arquitetura de adaptadores desde a primeira versão.
