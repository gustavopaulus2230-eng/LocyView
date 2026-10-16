# Página de links

## Objetivo

Reunir os canais e o catálogo LocyTech em uma página adequada à bio do Instagram.

## Visão geral

`Hub` apresenta a identidade da marca e quatro opções, nesta ordem: Instagram, WhatsApp, LinkedIn e Nossos produtos. As três primeiras abrem os links configurados em outra aba. Se o endereço estiver vazio, um diálogo informa que o canal não está configurado. Nossos produtos troca para o catálogo sem alterar o fragmento compartilhado da URL.

`BrandFooter` mostra a assinatura quando `showBrand` estiver ativo. Os controles de personalização e compartilhamento não aparecem no modo público.

## Arquivos fonte de verdade

- `src/pages/Hub.jsx`.
- `src/App.jsx`.
- `src/components/BrandAtmosphere.jsx`.
- `src/styles/global.css`.

## Modelo de dados / fluxo

`state.links` contém sempre Instagram, WhatsApp e LinkedIn. A quantidade exibida em Nossos produtos considera apenas produtos habilitados. Textos e cores são lidos do estado; URLs passam por `safeUrl`.

## Regras críticas

- Não adicionar endereço, serviços de beleza ou opções além das quatro solicitadas.
- Não exibir produtos na página inicial.
- Não inventar perfis sociais ou telefone da empresa.
- Manter links externos com `noopener noreferrer`.
- Preservar leitura e alvos de toque em telas estreitas.

## O que revisar antes de alterar

- Verificar as quatro opções, a ordem e os endereços configurados.
- Conferir o estado sem logo, o rodapé desativado e textos longos.
- Testar a abertura do catálogo e o retorno aos links.
- Verificar larguras de 320 e 390 pixels, além do computador.

## Código relacionado

- [Página de links e rodapé](../../src/pages/Hub.jsx)
- [Navegação e estado](../../src/App.jsx)
- [Identidade visual](../../src/components/BrandAtmosphere.jsx)
- [Validação dos links](../../src/utils/pageState.js)
- [Estilos responsivos](../../src/styles/global.css)
