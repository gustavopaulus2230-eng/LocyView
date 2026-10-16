# Personalização e compartilhamento

## Objetivo

Editar identidade, produtos e canais da página sem depender de um back-end nesta demonstração.

## Visão geral

`Editor` abre as abas Identidade, Produtos e Links e contatos. Alterações aparecem na prévia. Salvar rascunho grava o estado somente no navegador. Gerar link abre `ShareDialog` com uma versão pública da página.

`ProductEditor` permite adicionar ou editar um produto. O painel também permite ordenar, ocultar e remover produtos. As abas podem ser percorridas pelas setas do teclado, Home e End.

## Arquivos fonte de verdade

- `src/components/Editor.jsx`.
- `src/App.jsx`.
- `src/utils/pageState.js`.

## Modelo de dados / fluxo

`changeState` atualiza a prévia e marca alterações não salvas. `saveDraft` grava `{ state, savedAt }` em `locytech-hub:v3`. Falhas de armazenamento exibem aviso e mantêm o conteúdo aberto.

A logo aceita PNG, JPEG e WebP de até 1,5 MB. `optimizeLogo` limita uploads personalizados a 400 pixels no maior lado e os converte para WebP. A logo padrão tratada é servida diretamente em sua resolução original. As cores alteram o fundo, os destaques e os botões, sem recolorir a imagem da logo; `contrastText` calcula o contraste dos textos sobre a cor principal. O catálogo aceita até 30 produtos e até oito itens em `features` por produto.

`publicSnapshot` inclui somente dados públicos, produtos habilitados e URLs validadas. `encodeSnapshot` suporta caracteres UTF-8. `decodeSnapshot` valida o conteúdo antes de normalizar. Links públicos inválidos mostram aviso e a demonstração padrão, sem acessar o rascunho local.

## Regras críticas

- O identificador da página não cria uma rota ou endereço curto nesta versão.
- Não anunciar cadastro centralizado ou publicação integrada à LocyTech como concluídos.
- Preservar dados personalizados durante a migração dos padrões antigos.
- Não mostrar os controles de edição no modo público.
- Não inserir segredos, dados internos ou campos de orçamento no fragmento compartilhado.

## O que revisar antes de alterar

- Testar as três abas, salvar, recarregar e gerar link.
- Conferir edição, ordem, visibilidade e remoção de produtos.
- Testar URL inválida, logo removida e troca da logo.
- Conferir versões legadas e dados personalizados.
- Verificar os avisos quando o navegador bloqueia armazenamento ou cópia.

## Código relacionado

- [Editor e formulário de produto](../../src/components/Editor.jsx)
- [Estado, rascunho e compartilhamento](../../src/App.jsx)
- [Normalização, imagem e versões públicas](../../src/utils/pageState.js)
