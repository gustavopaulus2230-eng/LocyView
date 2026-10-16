# Página de links

## Objetivo

Reunir os canais e o catálogo LocyTech em uma página adequada à bio do Instagram.

## Visão geral

`Hub` apresenta a identidade da marca e quatro opções, nesta ordem: Instagram, WhatsApp, LinkedIn e Nossos produtos. As três primeiras abrem os links configurados em outra aba. Se o endereço estiver vazio, um diálogo informa que o canal não está configurado. Nossos produtos troca para o catálogo sem alterar o fragmento compartilhado da URL.

`BrandFooter` mostra a assinatura quando `showBrand` estiver ativo. Os controles Personalizar página e Compartilhar página existem somente no ambiente de desenvolvimento, fora do modo público. Nenhum deles aparece no site publicado ou na prévia de produção, tanto na página inicial quanto no catálogo.

## Arquivos fonte de verdade

- `src/pages/Hub.jsx`.
- `src/App.jsx`.
- `src/components/BrandAtmosphere.jsx`.
- `src/styles/global.css`.

## Modelo de dados / fluxo

`state.links` contém sempre Instagram, WhatsApp e LinkedIn. A quantidade exibida em Nossos produtos considera apenas produtos habilitados. Textos e cores são lidos do estado; URLs passam por `safeUrl`.

Os destinos iniciais fornecidos pelo usuário são Instagram em `https://www.instagram.com/locytech/` e WhatsApp em `https://wa.me/5551920057268`, correspondente ao telefone +55 51 92005-7268. O LinkedIn permanece no endereço genérico `https://www.linkedin.com/`, ainda como exemplo editável. A normalização substitui apenas os endereços genéricos antigos conhecidos de Instagram e WhatsApp; outros links personalizados são preservados.

## Regras críticas

- Não adicionar endereço, serviços de beleza ou opções além das quatro solicitadas.
- Não exibir produtos na página inicial.
- Não inventar perfis sociais ou telefone da empresa.
- Manter os controles de personalização e compartilhamento restritos ao desenvolvimento, sem criar outro modo ou URL para acessá-los em produção.
- Manter links externos com `noopener noreferrer`.
- Preservar leitura e alvos de toque em telas estreitas.

## O que revisar antes de alterar

- Verificar as quatro opções, a ordem e os endereços configurados.
- Conferir o estado sem logo, o rodapé desativado e textos longos.
- Testar a abertura do catálogo e o retorno aos links.
- Conferir a ausência dos dois controles na página inicial e no catálogo após a construção de produção, com ou sem fragmento compartilhado na URL.
- Verificar larguras de 320 e 390 pixels, além do computador.

## Código relacionado

- [Página de links e rodapé](../../src/pages/Hub.jsx)
- [Navegação e estado](../../src/App.jsx)
- [Identidade visual](../../src/components/BrandAtmosphere.jsx)
- [Validação dos links](../../src/utils/pageState.js)
- [Estilos responsivos](../../src/styles/global.css)
