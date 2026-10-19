# LocyTech — Links, produtos e painel LocyView

Front-end React da página LocyTech, atualizado em 2026-10-16 a partir da referência visual fornecida. O código da aplicação está em `front/`, separado de qualquer back-end.

O painel LocyView em `/admin` e `/admin/` permite configurar páginas dos clientes com logo, nome, textos, cores, canais e produtos. A entrega solicitada em 2026-10-19 é somente front-end: os dados ficam no navegador atual, sem integração com servidor ou autenticação real.

O site existente mantém seus quatro atalhos: Instagram, WhatsApp, LinkedIn e Nossos produtos. O catálogo aparece somente após o clique, com preços ilustrativos e opções editáveis. O visual é responsivo para celular e computador. A identidade pública usa somente LocyTech, com a logo tratada nítida sobre o fundo estrelado.

Instagram aponta para `https://www.instagram.com/locytech/` e WhatsApp para `https://wa.me/5551920057268`, telefone +55 51 92005-7268. Somente o LinkedIn permanece como exemplo. Os cinco produtos iniciais estão com R$ 0,00, sem oferta de serviço gratuito e mantendo os avisos de demonstração. A migração atualiza somente padrões antigos conhecidos e preserva links e preços personalizados.

## Executar

Instale as dependências em `front/` com `npm install`. Na raiz, `npm run dev` abre a prévia em `http://127.0.0.1:4173/`; `npm run build` prepara `build/` na raiz para publicação; `npm run preview` serve esse resultado.

O estado é local ao navegador. Não há API, autenticação, cadastro centralizado nem envio automático de orçamento. O acesso do Site hospedado não foi alterado. A rota `/admin` abre uma interface administrativa, não uma área protegida por login.

Os controles Personalizar página e Compartilhar página ficam disponíveis somente na prévia de desenvolvimento, fora do modo público. Eles não aparecem no site publicado nem na prévia de produção, seja na página inicial ou no catálogo.

O painel separado continua disponível na construção de produção. Ele permite pesquisar e filtrar cadastros, criar ou editar páginas em quatro abas e salvar manualmente até 50 registros em `locyview-admin:v1`, sem modificar o rascunho antigo `locytech-hub:v3`. O modelo inicial é somente a configuração LocyTech; não há métricas de acesso ou vendas simuladas.

A prévia de cada cliente usa um snapshot público em `/#p=`. O identificador não cria um endereço curto e não há publicação automática em servidor. Alterações locais não atualizam snapshots antigos e não há revogação de links já compartilhados. Não inclua informações sigilosas no conteúdo público.

O endereço principal `/` se adapta automaticamente à largura disponível. No celular, a identidade é compacta e os quatro atalhos ficam grandes, em uma coluna, com rolagem natural. A partir de 901 pixels, o computador usa identidade e atalhos lado a lado. Não há iframe, moldura de aparelho, detecção por `userAgent` ou link exclusivo para celular. Links antigos com `?preview=mobile` continuam funcionando e abrem o mesmo aplicativo; o parâmetro é ignorado, preservando os demais parâmetros e o fragmento da URL.

## Documentação

- [Orientações do front](front/README.md)
- [Arquitetura](front/docs/arquitetura.md)
- [Página de links](front/docs/telas/pagina-de-links.md)
- [Catálogo](front/docs/telas/catalogo.md)
- [Personalização](front/docs/telas/personalizacao.md)
- [Painel LocyView](front/docs/telas/painel-locyview.md)
- [Componentes](front/docs/componentes/interface.md)

## Código relacionado

- [Aplicação React](front/src/App.jsx)
- [Painel de clientes](front/src/admin/AdminApp.jsx)
- [Estado administrativo local](front/src/utils/adminState.js)
- [Comandos](package.json)
- [Configuração do Site](.openai/hosting.json)
- [Entrada da aplicação](front/src/index.jsx)
- [Estilos responsivos](front/src/styles/global.css)
