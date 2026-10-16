# Front-end LocyTech

Página de links e catálogo em React, com visual azul-escuro, azul e amarelo inspirado na referência fornecida. O projeto contém somente o front-end; não há autenticação, API, banco de dados ou envio automático de mensagens.

## Uso local

Na pasta `front/`, execute `npm install` na primeira preparação e `npm run dev` para abrir a prévia em `http://127.0.0.1:4173/`.

`npm run build` gera `../build/`, na raiz do repositório; `npm run preview` abre o resultado preparado. Não edite arquivos gerados ou o arquivo de trava das dependências manualmente.

Personalizar página e Compartilhar página aparecem apenas na prévia de desenvolvimento, fora do modo público. O site publicado e `npm run preview` não exibem esses controles na página inicial nem no catálogo.

Adicione `?preview=mobile` ao endereço para abrir a Prévia para celular, inclusive no host publicado. Ela mostra o aplicativo existente em um quadro de 390 × 844 pixels, reduzido em telas menores, sem duplicar o front. É uma prévia de tamanho, não emulação de aparelho. O link Abrir site normal retorna ao aplicativo na mesma aba; os demais parâmetros e o fragmento compartilhado são preservados.

## Funcionalidades

- Instagram, WhatsApp, LinkedIn e Nossos produtos como quatro opções iniciais.
- Catálogo aberto por clique, com filtros, detalhes e os cinco preços iniciais em R$ 0,00, ainda identificados como ilustrativos.
- Editor interno de identidade, cores, logo, produtos e links, disponível somente em desenvolvimento.
- Rascunho salvo no navegador e geração de link de demonstração no ambiente de desenvolvimento; links públicos não exibem controles de edição.
- Solicitação de orçamento preparada para copiar, sem envio automático.
- Prévia móvel por parâmetro de URL, com enquadramento isolado e iframe acessível de mesma origem.

O Instagram inicial abre `https://www.instagram.com/locytech/`; o WhatsApp usa `https://wa.me/5551920057268`, correspondente ao telefone +55 51 92005-7268. O LinkedIn permanece como exemplo editável. Os valores zerados não anunciam serviços gratuitos; o preço final depende do escopo. A normalização atualiza apenas endereços e preços padrões antigos conhecidos, preservando personalizações.

Endereço curto e cadastro centralizado exigem integração futura com a LocyTech. A identidade pública usa somente LocyTech e a logo tratada é apresentada sem efeito pontilhado.

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
- [Prévia para celular](src/components/MobilePreview.jsx)
- [Estilos da prévia](src/styles/mobilePreview.css)
