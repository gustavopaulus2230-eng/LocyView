# Arquitetura do front-end

## Objetivo

Implementar a página de links e o catálogo digital LocyTech e o painel de clientes LocyView em React, sem back-end. O site preserva os quatro atalhos e a edição local; o painel permite configurar páginas de clientes com armazenamento separado no navegador.

## Visão geral

`src/index.jsx` seleciona `AdminApp` para `/admin` e `/admin/` e `App` para o site público. A tela inicial `Hub` contém Instagram, WhatsApp, LinkedIn e Nossos produtos. A quarta opção abre `Products`; as outras abrem os endereços configurados. O editor antigo `Editor` altera identidade, catálogo e links no ambiente de desenvolvimento. O painel LocyView tem listagem e cadastro próprios, sem acrescentar atalhos à página pública.

O visual usa fundo azul-escuro, destaques azuis e amarelos, logo nítida integrada ao fundo estrelado e opções com texto grande. A marca pública é somente LocyTech, sem o prefixo Monitor. A experiência prioriza o celular: identidade compacta, atalhos em uma coluna e rolagem natural, sem moldura de aparelho. A partir de 901 pixels, a composição usa duas colunas. A adaptação ocorre por largura disponível em CSS, sem identificação por `userAgent`. As animações respeitam `prefers-reduced-motion`.

## Arquivos fonte de verdade

- `src/App.jsx`: estado, navegação, orçamento, compartilhamento e abertura dos diálogos.
- `src/pages/Hub.jsx` e `src/pages/Products.jsx`: telas públicas.
- `src/components/Editor.jsx`: edição da página e dos produtos.
- `src/components/PageFields.jsx`: campos de marca, cores e contatos compartilhados pelo editor e pelo painel.
- `src/admin/AdminApp.jsx`: listagem e configuração das páginas dos clientes.
- `src/utils/adminState.js`: validação, armazenamento local administrativo e links de prévia.
- `src/components/BrandAtmosphere.jsx`: identidade visual em canvas.
- `src/components/Modal.jsx` e `src/components/Icon.jsx`: diálogo nativo e ícones SVG.
- `src/utils/pageState.js`: dados iniciais, validação, normalização e versões compartilhadas.
- `src/styles/global.css`: tema, interação e responsividade.
- `src/styles/admin.css`: layout responsivo e componentes específicos do painel.
- `src/index.jsx`: entrada React e escolha entre painel e site por caminho, sem identificação de aparelho.

## Modelo de dados / fluxo

O estado versão 3 contém `name`, `eyebrow`, `description`, `slug`, `logo`, `primaryColor`, `accentColor`, `backgroundColor`, `showBrand`, `products` e `links`. Não há banco de dados nem chamadas de API.

O rascunho usa `localStorage` com a chave `locytech-hub:v3`, mantendo leitura da chave anterior `locytech-catalog:v2`. `normalize` valida dados e atualiza somente padrões antigos conhecidos, preservando personalizações.

As migrações anteriores ficam separadas da sanitização pela opção `migrateDefaults`. O painel de clientes desativa essa opção, preservando os valores configurados mesmo quando coincidem com padrões antigos da LocyTech. Novos snapshots incluem `preserveConfiguredValues: true`; sua leitura também desativa migrações. Rascunhos e snapshots antigos continuam compatíveis.

`shareUrl` cria um fragmento `#p=` com uma versão pública sanitizada. Esse modo não carrega o rascunho local nem mostra controles de edição. O orçamento é preparado apenas na memória; não é incluído no rascunho nem no link compartilhado.

O painel usa a chave independente `locyview-admin:v1`, com `{ version: 1, records }`. Cada registro contém `{ id, clientName, page, updatedAt }`, e `page` reaproveita o esquema público versão 3. Sem chave salva, é carregado somente o modelo LocyTech; uma lista vazia persistida não recria o modelo. O limite é de 50 registros, com salvamento manual, validação de campos obrigatórios, identificador único e URLs preenchidas. Falhas de leitura ou gravação são informadas sem fingir sincronização com servidor.

`clientPreviewUrl` usa a origem do endereço atual, remove caminho e parâmetros administrativos e gera um snapshot público em `/#p=`. O nome administrativo e a data de alteração ficam fora do link. Identificadores são apenas locais: não criam rotas curtas. Os links gerados representam versões dos dados e não recebem atualizações automáticas quando o cadastro é editado. Não existe revogação dos snapshots já compartilhados.

O endereço principal `/` serve a mesma aplicação para celular, tablet e computador, sem iframe ou redirecionamento. O antigo parâmetro `?preview=mobile` é ignorado pela entrada React e não força uma moldura de tamanho fixo. Os demais parâmetros e o fragmento continuam na URL; o tratamento de versões públicas, contatos e edição permanece inalterado.

`App` limita `ownerTools` a `import.meta.env.DEV && !initial.publicMode`. Assim, Personalizar página e Compartilhar página ficam disponíveis apenas na prévia de desenvolvimento não pública. O site publicado e a prévia de produção nunca renderizam esses controles, na página inicial ou no catálogo, independentemente do fragmento da URL. Essa limitação de interface não é autenticação e não cria outro modo de acesso em produção.

`/admin` é uma interface explícita de front-end disponível também na construção de produção; não altera `ownerTools`, não exige login e não protege dados por autenticação. Os registros pertencem ao armazenamento do navegador atual, sem sincronização entre computadores ou celulares. Integração com servidor, autorização e cadastro centralizado continuam fora desta entrega.

A logo padrão usa o caminho absoluto `/assets/locytech-hd.png` para funcionar tanto em `/` quanto em `/admin/`. `safeLogo` mantém a compatibilidade com os caminhos relativos antigos já salvos e preserva logos personalizadas válidas.

Vite gera `build/` na raiz do repositório, fora da pasta `front/`, para atender à configuração estática do Sites. O arquivo `.openai/hosting.json` na raiz do repositório aponta para esse diretório e mantém a identidade do Site existente. `build/`, `node_modules/` e o arquivo de trava das dependências são gerados automaticamente; não devem ser editados à mão.

## Regras críticas

- Trabalhar somente neste front; não adicionar servidor, banco de dados, autenticação ou envio de mensagens nesta tarefa.
- Manter exatamente quatro opções na página inicial e o catálogo fechado até o clique.
- Mostrar que os preços são ilustrativos, inclusive R$ 0,00, sem anunciar oferta gratuita. Instagram e WhatsApp usam os destinos fornecidos pelo usuário; somente o LinkedIn permanece como exemplo editável.
- Não carregar o rascunho privado quando um link público estiver inválido.
- Manter os controles antigos de personalização e compartilhamento de `App` fora de todas as construções de produção, sem depender de um link público para ocultá-los.
- Manter o painel separado em `/admin`, sem tratar sua rota como autenticação ou afirmar que dados foram publicados ou enviados a um servidor.
- Preservar a separação entre `locyview-admin:v1`, o rascunho antigo e os snapshots públicos; não compartilhar nome administrativo, data de alteração ou dados sigilosos.
- Não misturar dados de orçamento com os dados compartilhados da página.
- Não usar emojis na interface; reutilizar `Icon`.
- Manter uma única aplicação responsiva, sem iframe, detecção de aparelho por `userAgent` ou URL especial para o celular.

## O que revisar antes de alterar

- Ler a tela/componente real e a documentação do domínio.
- Conferir se a funcionalidade já existe antes de criar outra.
- Testar celular e computador, teclado, modais e dados salvos anteriormente.
- Conferir os dois controles somente no desenvolvimento não público e sua ausência na produção, tanto na página inicial quanto no catálogo.
- Conferir a adaptação do mesmo link no celular, tablet e computador, sem rolagem horizontal; testar catálogo, diálogos e rolagem natural, inclusive com o parâmetro antigo `preview=mobile` e fragmento compartilhado.
- Conferir `/admin` e `/admin/`, cadastro local, pesquisa e filtro, abas, logo, cores, contatos, produtos, validação, limite de 50 registros e falhas de armazenamento.
- Verificar que a prévia do cliente usa `/` e snapshot sanitizado, sem criar uma rota por identificador ou sincronização fictícia.
- Executar `npm run build` na raiz ou em `front/`.
- Atualizar os documentos de domínio antes das regras do projeto e do README.

## Código relacionado

- [Aplicação](../src/App.jsx)
- [Entrada React](../src/index.jsx)
- [Estado e validação](../src/utils/pageState.js)
- [Painel LocyView](../src/admin/AdminApp.jsx)
- [Estado administrativo](../src/utils/adminState.js)
- [Campos compartilhados](../src/components/PageFields.jsx)
- [Estilos](../src/styles/global.css)
- [Estilos do painel](../src/styles/admin.css)
- [Dependências do front](../package.json)
- [Configuração de publicação](../../.openai/hosting.json)
