# Contrato inegociável de qualidade responsiva

Este contrato vale para toda nova tela, componente, integração visual e alteração existente do Veiculow/Ponto Auto. Nenhuma entrega é considerada pronta sem cumprir estes critérios.

## 1. Botões e ações

- Todo botão deve manter seu texto em uma única linha (`white-space: nowrap` ou largura suficiente).
- Nenhum botão pode cortar texto, quebrar em duas linhas ou ficar menor que 44px de altura/área de toque.
- A ação principal deve ser visualmente evidente e existir em cada estado relevante: normal, foco, hover, carregando, sucesso e erro.
- Em telas estreitas, botões que não couberem lado a lado devem ocupar linhas separadas com espaçamento consistente.

## 2. Texto e leitura

- O texto deve respeitar a hierarquia do Design System e continuar legível sem zoom.
- O corpo de texto deve ter tamanho mínimo de 14px, salvo textos auxiliares claramente secundários.
- Títulos devem usar `clamp()` ou tokens responsivos, evitando estouro horizontal.
- Textos longos devem ter truncamento intencional, expansão ou quebra controlada; nunca podem empurrar a largura da página.

## 3. Imagens e mídia

- Toda imagem precisa de `alt` descritivo quando tiver significado; imagens decorativas devem usar `alt=""`.
- Toda imagem deve ter enquadramento definido por breakpoint, `object-fit` e `object-position` quando necessário.
- Imagens não podem causar layout shift: reservar proporção, altura ou usar `fill` dentro de um contêiner posicionado.
- O conteúdo principal da imagem deve permanecer visível em mobile; cortes devem ser intencionais e verificados.

## 4. Layout e overflow

- Nenhuma tela pode criar rolagem horizontal involuntária.
- O layout deve ser validado em pelo menos 360px, 390px, 768px e desktop.
- Cards, tabelas e listas extensas devem usar slider/rolagem horizontal controlada ou empilhamento adequado — nunca uma coluna estreita ilegível.
- Áreas clicáveis devem ter distância suficiente para evitar toques acidentais.

## 5. Sliders e conteúdo repetido

- Sliders devem ter `scroll-snap`, indicação visual de continuidade e não podem esconder a primeira ação.
- O primeiro item deve aparecer parcialmente ou haver outro indicador claro de que existe mais conteúdo.
- Não usar carrossel automático para conteúdo essencial sem controles manuais e pausa acessível.

## 6. Validação obrigatória antes de considerar pronto

- Testar a rota no mobile real ou em viewport mobile.
- Verificar botões, menus, links, inputs, sliders, estados vazios e mensagens de erro.
- Conferir console sem erro, imagens carregadas, foco por teclado e contraste suficiente.
- Capturar pelo menos uma evidência visual mobile antes do commit.
- Executar `npm run build` antes do merge/deploy.

## Regra de bloqueio

Se qualquer item acima falhar, a entrega deve ser considerada **incompleta** e não deve ser publicada como pronta.
