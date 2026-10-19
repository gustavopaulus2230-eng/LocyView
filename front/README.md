# Front-end LocyTech e painel LocyView

Página de links, catálogo e painel de clientes em React, com visual azul-escuro, azul e amarelo inspirado na referência fornecida. O projeto contém somente o front-end; não há autenticação, API, banco de dados ou envio automático de mensagens.

## Uso local

Na pasta `front/`, execute `npm install` na primeira preparação e `npm run dev` para abrir a prévia em `http://127.0.0.1:4173/`.

`npm run build` gera `../build/`, na raiz do repositório; `npm run preview` abre o resultado preparado. Não edite arquivos gerados ou o arquivo de trava das dependências manualmente.

Personalizar página e Compartilhar página aparecem apenas na prévia de desenvolvimento, fora do modo público. O site publicado e `npm run preview` não exibem esses controles na página inicial nem no catálogo.

Abra `http://127.0.0.1:4173/admin` ou `/admin/` para acessar o painel LocyView. Ele funciona também na construção de produção, separado do site em `/`. Essa rota não é autenticação e não representa uma integração com servidor.

Use o endereço principal `/` em qualquer aparelho. O layout prioriza o celular, com identidade compacta, atalhos grandes em uma coluna e rolagem natural. A partir de 901 pixels, identidade e atalhos ficam lado a lado. A adaptação é feita pela largura disponível, sem identificar o aparelho, usar iframe ou exigir um link especial. Links antigos com `?preview=mobile` abrem a mesma aplicação; o parâmetro é ignorado, sem redirecionamento ou remoção dos demais parâmetros e do fragmento compartilhado.

## Funcionalidades

- Instagram, WhatsApp, LinkedIn e Nossos produtos como quatro opções iniciais.
- Catálogo aberto por clique, com filtros, detalhes e os cinco preços iniciais em R$ 0,00, ainda identificados como ilustrativos.
- Editor interno de identidade, cores, logo, produtos e links, disponível somente em desenvolvimento.
- Rascunho salvo no navegador e geração de link de demonstração no ambiente de desenvolvimento; links públicos não exibem controles de edição.
- Solicitação de orçamento preparada para copiar, sem envio automático.
- Layout responsivo com prioridade para celular e adaptação automática para tablet e computador no mesmo endereço.
- Painel separado para pesquisar e filtrar páginas, criar e editar cadastros de clientes com identidade, aparência, links e produtos.
- Upload de logo, três cores, catálogo reutilizado e prévia visual no cadastro.
- Salvamento manual de até 50 cadastros neste navegador e geração de snapshots públicos da página configurada.

O Instagram inicial abre `https://www.instagram.com/locytech/`; o WhatsApp usa `https://wa.me/5551920057268`, correspondente ao telefone +55 51 92005-7268. O LinkedIn permanece como exemplo editável. Os valores zerados não anunciam serviços gratuitos; o preço final depende do escopo. A normalização atualiza apenas endereços e preços padrões antigos conhecidos, preservando personalizações.

O painel usa `locyview-admin:v1`, separado do rascunho antigo `locytech-hub:v3`. A primeira abertura mostra somente o modelo LocyTech; cadastros novos começam sem os dados do cliente. Não há métricas de acesso ou vendas inventadas. Armazenamento bloqueado, dados salvos inválidos e falta de espaço são informados na interface.

Links de prévia usam `/` e `#p=` com os dados públicos da versão gerada, sem nome administrativo ou data de alteração. Eles não são atualizados automaticamente por edições locais e não há revogação de snapshots compartilhados. O identificador não cria um endereço curto; cadastro centralizado, autenticação e sincronização exigem integração futura. A identidade pública usa somente LocyTech e a logo tratada é apresentada sem efeito pontilhado.

## Documentação

- [Arquitetura](docs/arquitetura.md)
- [Página de links](docs/telas/pagina-de-links.md)
- [Catálogo e orçamento](docs/telas/catalogo.md)
- [Personalização](docs/telas/personalizacao.md)
- [Painel LocyView](docs/telas/painel-locyview.md)
- [Componentes de interface](docs/componentes/interface.md)

## Código relacionado

- [Entrada React](src/index.jsx)
- [Aplicação](src/App.jsx)
- [Dados e versões públicas](src/utils/pageState.js)
- [Painel de clientes](src/admin/AdminApp.jsx)
- [Persistência administrativa local](src/utils/adminState.js)
- [Campos compartilhados](src/components/PageFields.jsx)
- [Tema](src/styles/global.css)
- [Estilos do painel](src/styles/admin.css)
- [Dependências e comandos](package.json)
