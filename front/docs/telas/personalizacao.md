# Personalização e compartilhamento

## Objetivo

Editar identidade, produtos e canais da página no editor de desenvolvimento e reutilizar esses campos no painel LocyView, sem depender de um back-end nesta demonstração.

## Visão geral

Os controles Personalizar página e Compartilhar página de `App` são renderizados somente quando `import.meta.env.DEV` está ativo e a página não está no modo público. Eles não aparecem em nenhuma construção de produção, inclusive na página inicial, no catálogo ou na prévia servida por `npm run preview`. O painel separado `/admin` não habilita esses controles; possui seu próprio fluxo administrativo de front-end, sem autenticação real.

Nesse ambiente interno, `Editor` abre as abas Identidade, Produtos e Links e contatos. Alterações aparecem na prévia. Salvar rascunho grava o estado somente no navegador. Gerar link abre `ShareDialog` com uma versão pública da página.

`ProductEditor` permite adicionar ou editar um produto. O painel também permite ordenar, ocultar e remover produtos. As abas podem ser percorridas pelas setas do teclado, Home e End.

`PageFields` compartilha os campos de marca, cores e contatos entre `Editor` e `AdminApp`, evitando uma segunda implementação da validação de logo e dos campos da página. O painel LocyView usa quatro abas próprias e armazenamento separado, conforme a documentação de seu domínio.

## Arquivos fonte de verdade

- `src/components/Editor.jsx`.
- `src/components/PageFields.jsx`.
- `src/App.jsx`.
- `src/utils/pageState.js`.

## Modelo de dados / fluxo

`changeState` atualiza a prévia e marca alterações não salvas. `saveDraft` grava `{ state, savedAt }` em `locytech-hub:v3`. Falhas de armazenamento exibem aviso e mantêm o conteúdo aberto.

A logo aceita PNG, JPEG e WebP de até 1,5 MB. `optimizeLogo` limita uploads personalizados a 400 pixels no maior lado e os converte para WebP. A logo padrão tratada é servida diretamente em sua resolução original. As cores alteram o fundo, os destaques e os botões, sem recolorir a imagem da logo; `contrastText` calcula o contraste dos textos sobre a cor principal. O catálogo aceita até 30 produtos e até oito itens em `features` por produto.

`publicSnapshot` inclui somente dados públicos, produtos habilitados e URLs validadas. `encodeSnapshot` suporta caracteres UTF-8. `decodeSnapshot` valida o conteúdo antes de normalizar. Links públicos inválidos mostram aviso e a demonstração padrão, sem acessar o rascunho local.

Novos snapshots incluem o sinalizador de protocolo `preserveConfiguredValues: true`, sem dados administrativos. Ele evita que cores, textos, links e preços do cliente sejam substituídos por migrações antigas da LocyTech. O painel normaliza sem migração; rascunhos e snapshots antigos mantêm a compatibilidade anterior.

Instagram e WhatsApp já têm os destinos fornecidos pelo usuário. Somente o LinkedIn continua como exemplo, conforme o aviso da aba Links e contatos. A migração reconhece os endereços genéricos anteriores desses dois canais e os preços padrões antigos dos cinco produtos; não substitui links ou preços personalizados por valores novos.

## Regras críticas

- O identificador da página não cria uma rota ou endereço curto nesta versão.
- Não anunciar cadastro centralizado ou publicação integrada à LocyTech como concluídos.
- Preservar dados personalizados durante a migração dos padrões antigos.
- Não mostrar os controles antigos de personalização e compartilhamento em produção nem no modo público de desenvolvimento. A condição de ambiente controla a interface, não implementa autenticação. O painel `/admin` é front-end independente e não representa uma integração com servidor.
- Não inserir segredos, dados internos ou campos de orçamento no fragmento compartilhado.

## O que revisar antes de alterar

- No ambiente de desenvolvimento, testar as três abas, salvar, recarregar e gerar link.
- Na construção de produção, conferir que os dois controles não existem na página inicial nem no catálogo, com ou sem `#p=`; em desenvolvimento, conferir também que não aparecem nos links públicos.
- Conferir edição, ordem, visibilidade e remoção de produtos.
- Testar URL inválida, logo removida e troca da logo.
- Conferir versões legadas e dados personalizados.
- Verificar os avisos quando o navegador bloqueia armazenamento ou cópia.

## Código relacionado

- [Editor e formulário de produto](../../src/components/Editor.jsx)
- [Campos compartilhados da página](../../src/components/PageFields.jsx)
- [Painel LocyView](../../src/admin/AdminApp.jsx)
- [Estado, rascunho e compartilhamento](../../src/App.jsx)
- [Normalização, imagem e versões públicas](../../src/utils/pageState.js)
