# Página de links

## Objetivo

Reunir os canais e o catálogo LocyTech em uma página adequada à bio do Instagram.

## Visão geral

`Hub` apresenta a identidade da marca e quatro opções, nesta ordem: Instagram, WhatsApp, LinkedIn e Nossos produtos. As três primeiras abrem os links configurados em outra aba. Se o endereço estiver vazio, um diálogo informa que o canal não está configurado. Nossos produtos troca para o catálogo sem alterar o fragmento compartilhado da URL.

`BrandFooter` mostra a assinatura quando `showBrand` estiver ativo. Os controles Personalizar página e Compartilhar página existem somente no ambiente de desenvolvimento, fora do modo público. Nenhum deles aparece no site publicado ou na prévia de produção, tanto na página inicial quanto no catálogo.

O parâmetro `?preview=mobile` abre a tela Prévia para celular. Ela enquadra o aplicativo existente em um iframe de mesma origem com área de 390 × 844 pixels, reduzida quando a tela externa é menor. Assim é possível conferir a composição móvel mesmo em uma aba larga no computador. Trata-se de uma prévia em tamanho de celular, não de emulação de aparelho.

## Arquivos fonte de verdade

- `src/pages/Hub.jsx`.
- `src/App.jsx`.
- `src/components/BrandAtmosphere.jsx`.
- `src/styles/global.css`.
- `src/components/MobilePreview.jsx` e `src/styles/mobilePreview.css`.

## Modelo de dados / fluxo

`state.links` contém sempre Instagram, WhatsApp e LinkedIn. A quantidade exibida em Nossos produtos considera apenas produtos habilitados. Textos e cores são lidos do estado; URLs passam por `safeUrl`.

Os destinos iniciais fornecidos pelo usuário são Instagram em `https://www.instagram.com/locytech/` e WhatsApp em `https://wa.me/5551920057268`, correspondente ao telefone +55 51 92005-7268. O LinkedIn permanece no endereço genérico `https://www.linkedin.com/`, ainda como exemplo editável. A normalização substitui apenas os endereços genéricos antigos conhecidos de Instagram e WhatsApp; outros links personalizados são preservados.

`index.jsx` seleciona a prévia somente quando `preview=mobile`. O destino do iframe remove apenas esse parâmetro, preservando os demais parâmetros e o fragmento da URL, sem montar uma segunda cópia do aplicativo no documento externo. O link Abrir site normal sai da prévia na mesma aba. A navegação comum, o editor e os contatos não são alterados por esse enquadramento.

## Regras críticas

- Não adicionar endereço, serviços de beleza ou opções além das quatro solicitadas.
- Não exibir produtos na página inicial.
- Não inventar perfis sociais ou telefone da empresa.
- Manter os controles de personalização e compartilhamento restritos ao desenvolvimento, sem criar outro modo ou URL para acessá-los em produção.
- Manter links externos com `noopener noreferrer`.
- Preservar leitura e alvos de toque em telas estreitas.
- Manter a prévia móvel separada dos estilos normais, com título acessível no iframe, sem duplicar o front ou alterar os controles de produção.

## O que revisar antes de alterar

- Verificar as quatro opções, a ordem e os endereços configurados.
- Conferir o estado sem logo, o rodapé desativado e textos longos.
- Testar a abertura do catálogo e o retorno aos links.
- Conferir a ausência dos dois controles na página inicial e no catálogo após a construção de produção, com ou sem fragmento compartilhado na URL.
- Verificar larguras de 320 e 390 pixels, além do computador.
- Abrir `?preview=mobile` em uma janela larga e conferir os quatro atalhos, catálogo, diálogos e rolagem dentro do quadro; testar o link para o site normal e a preservação de parâmetros e fragmento.

## Código relacionado

- [Página de links e rodapé](../../src/pages/Hub.jsx)
- [Navegação e estado](../../src/App.jsx)
- [Identidade visual](../../src/components/BrandAtmosphere.jsx)
- [Validação dos links](../../src/utils/pageState.js)
- [Estilos responsivos](../../src/styles/global.css)
- [Seleção da prévia](../../src/index.jsx)
- [Prévia para celular](../../src/components/MobilePreview.jsx)
- [Estilos isolados da prévia](../../src/styles/mobilePreview.css)
