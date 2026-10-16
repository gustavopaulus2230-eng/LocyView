# Front-end LocyTech

Página de links e catálogo em React, com visual azul-escuro, azul e amarelo inspirado na referência fornecida. O projeto contém somente o front-end; não há autenticação, API, banco de dados ou envio automático de mensagens.

## Uso local

Na pasta `front/`, execute `npm install` na primeira preparação e `npm run dev` para abrir a prévia em `http://127.0.0.1:4173/`.

`npm run build` gera `../build/`, na raiz do repositório; `npm run preview` abre o resultado preparado. Não edite arquivos gerados ou o arquivo de trava das dependências manualmente.

## Funcionalidades

- Instagram, WhatsApp, LinkedIn e Nossos produtos como quatro opções iniciais.
- Catálogo aberto por clique, com filtros, detalhes e preços ilustrativos.
- Editor de identidade, cores, logo, produtos e links.
- Rascunho salvo no navegador e link de demonstração sem controles de edição.
- Solicitação de orçamento preparada para copiar, sem envio automático.

Os links sociais iniciais são exemplos. Endereço curto e cadastro centralizado exigem integração futura com a LocyTech. A identidade pública usa somente LocyTech e a logo tratada é apresentada sem efeito pontilhado.

## Documentação

- [Arquitetura](docs/arquitetura.md)
- [Página de links](docs/telas/pagina-de-links.md)
- [Catálogo e orçamento](docs/telas/catalogo.md)
- [Personalização](docs/telas/personalizacao.md)
- [Componentes de interface](docs/componentes/interface.md)

## Código relacionado

- [Entrada React](src/index.jsx)
- [Aplicação](src/App.jsx)
- [Dados e versões públicas](src/utils/pageState.js)
- [Tema](src/styles/global.css)
- [Dependências e comandos](package.json)
