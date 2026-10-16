# Arquitetura do front-end

## Objetivo

Implementar a página de links e o catálogo digital LocyTech em React, sem back-end. Esta versão substitui o front estático anterior, preservando os quatro atalhos e a edição local.

## Visão geral

`src/index.jsx` monta `App`. A tela inicial `Hub` contém Instagram, WhatsApp, LinkedIn e Nossos produtos. A quarta opção abre `Products`; as outras abrem os endereços configurados. O painel `Editor` altera identidade, catálogo e links no ambiente de desenvolvimento.

O visual usa fundo azul-escuro, destaques azuis e amarelos, logo nítida integrada ao fundo estrelado e opções com texto grande. A marca pública é somente LocyTech, sem o prefixo Monitor. A composição em duas colunas passa a uma coluna em telas de até 900 pixels. As animações respeitam `prefers-reduced-motion`.

## Arquivos fonte de verdade

- `src/App.jsx`: estado, navegação, orçamento, compartilhamento e abertura dos diálogos.
- `src/pages/Hub.jsx` e `src/pages/Products.jsx`: telas públicas.
- `src/components/Editor.jsx`: edição da página e dos produtos.
- `src/components/BrandAtmosphere.jsx`: identidade visual em canvas.
- `src/components/Modal.jsx` e `src/components/Icon.jsx`: diálogo nativo e ícones SVG.
- `src/utils/pageState.js`: dados iniciais, validação, normalização e versões compartilhadas.
- `src/styles/global.css`: tema, interação e responsividade.

## Modelo de dados / fluxo

O estado versão 3 contém `name`, `eyebrow`, `description`, `slug`, `logo`, `primaryColor`, `accentColor`, `backgroundColor`, `showBrand`, `products` e `links`. Não há banco de dados nem chamadas de API.

O rascunho usa `localStorage` com a chave `locytech-hub:v3`, mantendo leitura da chave anterior `locytech-catalog:v2`. `normalize` valida dados e atualiza somente padrões antigos conhecidos, preservando personalizações.

`shareUrl` cria um fragmento `#p=` com uma versão pública sanitizada. Esse modo não carrega o rascunho local nem mostra controles de edição. O orçamento é preparado apenas na memória; não é incluído no rascunho nem no link compartilhado.

`App` limita `ownerTools` a `import.meta.env.DEV && !initial.publicMode`. Assim, Personalizar página e Compartilhar página ficam disponíveis apenas na prévia de desenvolvimento não pública. O site publicado e a prévia de produção nunca renderizam esses controles, na página inicial ou no catálogo, independentemente do fragmento da URL. Essa limitação de interface não é autenticação e não cria outro modo de acesso em produção.

Vite gera `build/` na raiz do repositório, fora da pasta `front/`, para atender à configuração estática do Sites. O arquivo `.openai/hosting.json` na raiz do repositório aponta para esse diretório e mantém a identidade do Site existente. `build/`, `node_modules/` e o arquivo de trava das dependências são gerados automaticamente; não devem ser editados à mão.

## Regras críticas

- Trabalhar somente neste front; não adicionar servidor, banco de dados, autenticação ou envio de mensagens nesta tarefa.
- Manter exatamente quatro opções na página inicial e o catálogo fechado até o clique.
- Mostrar que os preços são ilustrativos, inclusive R$ 0,00, sem anunciar oferta gratuita. Instagram e WhatsApp usam os destinos fornecidos pelo usuário; somente o LinkedIn permanece como exemplo editável.
- Não carregar o rascunho privado quando um link público estiver inválido.
- Manter os controles de personalização e compartilhamento fora de todas as construções de produção, sem depender de um link público para ocultá-los.
- Não misturar dados de orçamento com os dados compartilhados da página.
- Não usar emojis na interface; reutilizar `Icon`.

## O que revisar antes de alterar

- Ler a tela/componente real e a documentação do domínio.
- Conferir se a funcionalidade já existe antes de criar outra.
- Testar celular e computador, teclado, modais e dados salvos anteriormente.
- Conferir os dois controles somente no desenvolvimento não público e sua ausência na produção, tanto na página inicial quanto no catálogo.
- Executar `npm run build` na raiz ou em `front/`.
- Atualizar os documentos de domínio antes das regras do projeto e do README.

## Código relacionado

- [Aplicação](../src/App.jsx)
- [Entrada React](../src/index.jsx)
- [Estado e validação](../src/utils/pageState.js)
- [Estilos](../src/styles/global.css)
- [Dependências do front](../package.json)
- [Configuração de publicação](../../.openai/hosting.json)
