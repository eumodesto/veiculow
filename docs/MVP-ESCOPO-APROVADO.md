# MVP — Escopo Aprovado para Início do Desenvolvimento

**Produto:** Plataforma Ponto Auto Veículos  
**Versão:** 1.0  
**Status:** Aprovado para desenvolvimento  
**Data:** 19 de outubro de 2026

## Configuração de infraestrutura aprovada

- **Domínio e DNS:** Cloudflare.
- **Banco, autenticação, Storage e filas:** Supabase.
- **Variáveis de ambiente:** arquivo local ou secrets do provedor de deploy.
- **Regra de segurança:** senha do banco, service role key e tokens da Meta nunca entram no repositório, documentação ou frontend.

## 1. Decisão principal

O sistema será desenvolvido inicialmente para **uma única loja, sem filiais**.

O cadastro da loja será a origem dos dados de identidade, contato, endereço, horário, fachada, logo e canais de atendimento.

## 2. Objetivo do MVP

Permitir que a loja cadastre seus veículos uma única vez, publique o estoque em um site profissional e crie/publice carrosséis de veículos diretamente no Instagram pela área administrativa.

## 3. Funcionalidades incluídas

### Loja e usuários

- perfil da loja;
- logo, fachada, endereço, horários e WhatsApp;
- autenticação;
- administrador, gerente, vendedor e editor;
- permissões para editar, publicar e aprovar.

### Veículos

- cadastro de marca, modelo, versão, ano, km, câmbio, combustível, preço, cor, carroceria e opcionais;
- status: rascunho, disponível, reservado, vendido e arquivado;
- descrição e código do anúncio;
- galeria de fotos;
- definição da foto principal;
- ordenação das fotos;
- histórico de alterações.

### Site público

- homepage com fachada real da loja;
- busca por marca/modelo e preço;
- estoque com filtros;
- cards de veículos;
- página detalhada do veículo;
- contato via WhatsApp;
- endereço, horário e como chegar;
- responsividade mobile;
- SEO básico e dados estruturados.

### Instagram

- conexão de conta Instagram profissional;
- geração automática de carrossel;
- padrão de 5 cards;
- mínimo de 3 e máximo de 10 cards;
- dimensão 1080 × 1350 px;
- edição da legenda e hashtags;
- revisão da sequência de cards;
- aprovação manual;
- publicação direta pela área administrativa;
- registro de status, data, resposta e identificador externo;
- reprocessamento sem duplicidade.

### Operação

- filas para processamento de imagens e publicações;
- tentativas automáticas em falhas recuperáveis;
- logs estruturados;
- auditoria;
- mensagens de erro compreensíveis;
- separação de dados por empresa usando RLS.

## 4. Estados do veículo

```text
Rascunho → Em revisão → Disponível → Reservado → Vendido → Arquivado
```

O status comercial do veículo é separado do status de publicação nos canais externos.

## 5. Regras de publicação

Um veículo só poderá ser publicado no site quando possuir os campos mínimos definidos e uma imagem principal válida.

Um carrossel só poderá ser publicado no Instagram quando:

- possuir entre 3 e 10 cards;
- tiver 5 cards como padrão, quando houver dados suficientes;
- estiver em 1080 × 1350 px;
- utilizar template aprovado;
- tiver legenda válida;
- tiver sido aprovado por usuário autorizado;
- existir conexão válida com a conta profissional.

## 6. Critérios de pronto

O MVP será considerado pronto quando:

- o administrador conseguir cadastrar a loja;
- o administrador conseguir cadastrar e publicar um veículo;
- o visitante conseguir buscar e abrir o veículo no site;
- o visitante conseguir iniciar contato pelo WhatsApp;
- o usuário autorizado conseguir gerar e revisar um carrossel;
- o carrossel puder ser publicado diretamente no Instagram;
- falhas puderem ser identificadas e reprocessadas;
- nenhuma publicação duplicada for criada pelo reprocessamento;
- os fluxos principais funcionarem em desktop e mobile;
- os dados publicados forem reais e vierem do cadastro central.

## 7. Fora do MVP

- filiais;
- aplicativo iOS ou Android;
- marketplace próprio;
- simulação de financiamento;
- CRM completo;
- BI avançado;
- automações por scraping;
- integração com todos os portais no primeiro ciclo.

Os adaptadores e o modelo de publicação devem ser preparados para que OLX, Webmotors, Mercado Livre e outros portais possam ser adicionados posteriormente.

## 8. Ordem de implementação

1. Fundação do projeto, Supabase, autenticação e Design System.
2. Perfil da loja e usuários.
3. Cadastro de veículos e imagens.
4. Homepage, estoque e detalhe do veículo.
5. WhatsApp e captura de leads.
6. Gerador de carrossel e preview.
7. Conexão com Instagram.
8. Publicação, status, erros e auditoria.
9. Testes, acessibilidade, performance e preparação para produção.

## 9. Documentos de referência

- [Arquitetura do sistema](./ARQUITETURA-SISTEMA.md)
- [Recomendações da homepage e Design System](./RECOMENDACOES-DESIGN-SYSTEM-HOMEPAGE.md)
- Design System visual fornecido pelo cliente: `Design_System_Loja_de_Veiculos.docx`
