# Recomendações para Homepage e Complementos do Design System

**Referências analisadas:**

- `Design_System_Loja_de_Veiculos.docx` — tratado como referência de especificação visual e funcional.
- Mockup da homepage Ponto Auto Veículos.
- `ícone.png` e `Logo horizontal.png`.

Este documento complementa o Design System existente. Não substitui suas regras de identidade, dados reais, acessibilidade ou publicação.

## 1. Avaliação geral

A homepage está bem direcionada e apresenta uma hierarquia clara:

1. identidade e fachada da loja;
2. chamada principal para o estoque;
3. busca rápida;
4. veículos em destaque;
5. visita à loja.

O visual transmite confiança, usa a fotografia real da operação e evita transformar a homepage em uma página genérica de catálogo. A paleta verde, o fundo claro e os cards com fotografia dominante estão coerentes com o manual.

As principais oportunidades são melhorar a conversão da busca, reduzir ambiguidades nos dados dos veículos, reforçar o comportamento mobile e transformar o Design System em uma biblioteca também preparada para redes sociais.

## 2. Recomendações prioritárias para a homepage

### Prioridade alta

#### 2.1 Transformar a busca em uma porta de entrada mais completa

O mockup oferece somente “Marca ou modelo” e “Faixa de preço”. Essa simplicidade é boa para a primeira interação, mas deve haver uma terceira ação visível:

- `Mais filtros` ou `Busca avançada`.

Filtros avançados recomendados:

- marca e modelo;
- preço mínimo e máximo;
- ano;
- quilometragem;
- câmbio;
- combustível;
- carroceria.

O botão deve levar ao estoque preservando os filtros na URL. No mobile, usar `Filtros` e `Ordenar` em uma barra fixa acima da lista, conforme o manual.

#### 2.2 Usar somente marcas realmente disponíveis

“Marcas mais buscadas” deve ser alimentado pelo estoque atual ou por dados reais de busca. Quando não houver dados suficientes, usar “Marcas no estoque”.

Evitar mostrar uma marca sem veículos publicados, pois isso aumenta frustração e reduz confiança.

#### 2.3 Enriquecer os cards sem aumentar a poluição visual

O card atual já apresenta modelo, versão, preço, ano e quilometragem. Recomenda-se acrescentar apenas um metadado operacional prioritário:

- câmbio, ou
- cidade da loja, quando for relevante para o contato.

Não adicionar todos os opcionais no card. Eles devem permanecer na página de detalhe.

Todos os cards da mesma linha devem manter a mesma altura, mesmo quando o nome do modelo ou a versão ocupar duas linhas.

#### 2.4 Tornar o status do veículo explícito

Adicionar estados visuais e textuais para:

- Disponível;
- Reservado;
- Vendido;
- Fotos em atualização;
- Consulte o preço.

O status nunca deve depender apenas da cor. O card deve impedir contato de compra quando o veículo estiver vendido, mas pode oferecer estoque semelhante.

### Prioridade média

#### 2.5 Melhorar a seção de confiança

Os três benefícios abaixo da busca são úteis, mas devem ser usados somente se forem verdadeiros e sustentados pela operação:

- veículos selecionados;
- atendimento especializado;
- negociação segura e transparente.

Sugestão de complemento: tornar cada item explicativo ao foco ou clique, com texto curto sobre o que a loja realmente oferece. Evitar transformar alegações institucionais em promessas absolutas.

#### 2.6 Fortalecer o CTA de visita

Na seção “Visite nossa loja”, manter:

- endereço real;
- horário de funcionamento;
- telefone ou WhatsApp;
- link `Como chegar` abrindo o mapa externo;
- foto real da fachada.

O mapa deve ser carregado sob demanda. O endereço em texto deve continuar disponível mesmo se o mapa falhar.

#### 2.7 Incluir prova social somente quando houver fonte real

Uma seção opcional pode ser adicionada depois:

- avaliações reais;
- nota média;
- origem da avaliação;
- quantidade verificável.

Não incluir depoimentos genéricos, números de clientes ou notas sem fonte.

## 3. Ajustes visuais recomendados

### Hero/banner

- Manter a fachada real como regra principal.
- Preparar uma imagem desktop de pelo menos 1920 × 1080 px.
- Preparar uma composição mobile própria, sem apenas cortar o desktop.
- Garantir que o letreiro e a entrada permaneçam visíveis.
- Manter o título em até três linhas no desktop e quatro no mobile.
- Testar o título sobre a área clara e sobre a imagem em diferentes larguras.
- Evitar que a foto do veículo na fachada concorra com o CTA principal.

### Cabeçalho

- Manter o logo entre 40 e 48 px de altura no desktop.
- No mobile, priorizar logo, favoritos e menu.
- Destacar somente a rota ativa.
- Manter o WhatsApp como ação principal, mas adicionar `aria-label` descritivo.
- Se o cabeçalho for fixo, testar foco de teclado e âncoras para garantir que nada fique coberto.

### Busca sobreposta

A caixa de busca está visualmente forte e funciona como ponte entre o banner e o estoque. Complementar com:

- estado de foco claramente visível;
- botão de limpar texto;
- sugestões de marca/modelo;
- mensagem de erro ou resultado vazio;
- carregamento sem deslocar o layout;
- versão não sobreposta no mobile.

### Cards

- Manter imagem 4:3.
- Usar `contain` quando o recorte cortar o veículo.
- Manter o favorito com `aria-pressed` e feedback de salvamento.
- Garantir contraste do botão sobre qualquer fotografia.
- Não usar selo verde para cada opcional.
- Manter o preço antes da ação principal.

## 4. Mobile e responsividade

O manual já define uma boa regra de uma coluna para veículos. Complementar com estes comportamentos:

- fachada antes do texto no banner mobile;
- busca em bloco separado da imagem;
- uma ação larga por card;
- CTA de WhatsApp fixa somente quando não cobrir filtros ou formulários;
- menu acessível por teclado e Escape;
- carrossel de marcas manual, sem autoplay;
- seção de localização empilhada;
- mapa abaixo do conteúdo textual;
- nenhuma rolagem horizontal em 320 px.

Testar obrigatoriamente em 320, 360, 390, 768, 1024 e 1440 px.

## 5. Complemento: Design System para carrossel do Instagram

O manual atual cobre muito bem a interface web, mas precisa de uma extensão específica para conteúdo social.

### Regras do carrossel

- O post será sempre carrossel.
- Padrão de 5 cards; mínimo de 3 e máximo de 10.
- Formato 1080 × 1350 px, proporção 4:5.
- Cada card deve ser uma imagem final, não uma captura da interface.
- O carrossel deve usar os mesmos tokens de cor, tipografia, logo e espaçamento do sistema.

### Sequência padrão

1. **Capa:** foto principal, logo, marca/modelo e chamada.
2. **Dados:** versão, ano/modelo, km, câmbio e combustível.
3. **Destaques:** opcionais, diferenciais e foto complementar.
4. **Oferta:** preço e condições cadastradas.
5. **Contato:** WhatsApp, localização e chamada para ação.

### Tokens adicionais para social

Adicionar ao Design System:

- `social.safeArea.top`;
- `social.safeArea.bottom`;
- `social.card.width`;
- `social.card.height`;
- `social.overlay.vehicle`;
- `social.text.maxLines`;
- `social.logo.maxWidth`;
- `social.contactBlock`;
- `social.templateVersion`.

### Regras de conteúdo

- Nunca inventar opcionais, preço, financiamento ou condições.
- Omitir um bloco quando o dado estiver ausente.
- Não usar texto menor que a escala mínima definida para leitura confortável.
- Manter o veículo visível mesmo com textos e overlays.
- Aplicar logo com área livre preservada.
- Salvar a versão do template e dos tokens utilizados em cada geração.

## 6. Complemento: Design System administrativo

O painel também deve ter padrões para a operação diária:

- status separado entre `status comercial` e `status de publicação`;
- fila de publicação por canal;
- visualização de erros por portal;
- preview do site e do carrossel antes de publicar;
- botão `Salvar rascunho` separado de `Publicar`;
- confirmação quando houver alterações não salvas;
- histórico de versões da arte;
- reprocessamento idempotente;
- permissões para aprovar post e publicar em redes sociais.

## 7. Métricas recomendadas

Instrumentar a homepage com eventos que representem intenção real:

- busca iniciada;
- filtro aplicado;
- veículo aberto;
- favorito salvo;
- WhatsApp acionado;
- rota para a loja acionada;
- formulário enviado;
- carrossel gerado;
- carrossel aprovado;
- publicação concluída;
- publicação recusada ou com erro.

Não chamar clique em WhatsApp de venda concluída. Venda, contato recebido e publicação realizada são eventos diferentes.

## 8. Checklist de aceite visual e funcional

- [ ] A fachada real aparece na primeira tela.
- [ ] O letreiro permanece identificável no desktop e no mobile.
- [ ] O CTA principal leva ao estoque real.
- [ ] A busca preserva filtros na URL.
- [ ] Marcas exibidas têm veículos disponíveis ou são claramente identificadas como busca.
- [ ] Cards exibem dados reais e estados transparentes.
- [ ] Fotos não são esticadas nem substituídas por imagens enganosas.
- [ ] O endereço e horário vêm do perfil da loja.
- [ ] O mobile não possui overflow horizontal.
- [ ] O foco de teclado é visível.
- [ ] O contraste é validado também sobre fotografias.
- [ ] O carrossel usa o mesmo Design System e possui 3 a 10 cards.
- [ ] O cliente pode revisar o carrossel antes de publicar.
- [ ] A publicação direta no Instagram registra status e erro.

## 9. Conclusão

Não é necessário redesenhar a homepage. A direção visual está correta. O melhor próximo passo é evoluir o sistema em três frentes:

1. tornar busca, status e dados mais orientados à operação real;
2. fechar os comportamentos de mobile e acessibilidade;
3. adicionar uma camada de Design System Social para gerar carrosséis consistentes e publicáveis.

Essas melhorias preservam a identidade Ponto Auto e aumentam clareza, confiança e capacidade de conversão sem adicionar decoração desnecessária.
