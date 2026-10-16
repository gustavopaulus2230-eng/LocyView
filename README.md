# LocyTech — Links e produtos

Front-end React da página LocyTech, atualizado em 2026-10-16 a partir da referência visual fornecida. O código da aplicação está em `front/`, separado de qualquer back-end.

O site existente mantém seus quatro atalhos: Instagram, WhatsApp, LinkedIn e Nossos produtos. O catálogo aparece somente após o clique, com preços ilustrativos e opções editáveis. O visual é responsivo para celular e computador. A identidade pública usa somente LocyTech, com a logo tratada nítida sobre o fundo estrelado.

## Executar

Instale as dependências em `front/` com `npm install`. Na raiz, `npm run dev` abre a prévia em `http://127.0.0.1:4173/`; `npm run build` prepara `build/` na raiz para publicação; `npm run preview` serve esse resultado.

O estado é local ao navegador. Não há API, autenticação, cadastro centralizado nem envio automático de orçamento. O acesso do Site hospedado não foi alterado.

Os controles Personalizar página e Compartilhar página ficam disponíveis somente na prévia de desenvolvimento, fora do modo público. Eles não aparecem no site publicado nem na prévia de produção, seja na página inicial ou no catálogo.

## Documentação

- [Orientações do front](front/README.md)
- [Arquitetura](front/docs/arquitetura.md)
- [Página de links](front/docs/telas/pagina-de-links.md)
- [Catálogo](front/docs/telas/catalogo.md)
- [Personalização](front/docs/telas/personalizacao.md)
- [Componentes](front/docs/componentes/interface.md)

## Código relacionado

- [Aplicação React](front/src/App.jsx)
- [Comandos](package.json)
- [Configuração do Site](.openai/hosting.json)
