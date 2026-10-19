# Página de links

## Objetivo

Reunir os canais e o catálogo LocyTech em uma página adequada à bio do Instagram.

## Visão geral

`Hub` apresenta a identidade da marca e quatro opções, nesta ordem: Instagram, WhatsApp, LinkedIn e Nossos produtos. As três primeiras abrem os links configurados em outra aba. Se o endereço estiver vazio, um diálogo informa que o canal não está configurado. Nossos produtos troca para o catálogo sem alterar o fragmento compartilhado da URL.

`BrandFooter` mostra a assinatura quando `showBrand` estiver ativo. Os controles Personalizar página e Compartilhar página existem somente no ambiente de desenvolvimento, fora do modo público. Nenhum deles aparece no site publicado ou na prévia de produção, tanto na página inicial quanto no catálogo.

O mesmo endereço principal `/` atende celular e computador. O layout prioriza o celular: identidade compacta, opções grandes em uma coluna e rolagem natural da página, sem moldura de aparelho ou iframe. A partir de 901 pixels, a identidade e os atalhos ficam lado a lado. A adaptação depende da largura disponível, não da identificação do dispositivo.

## Arquivos fonte de verdade

- `src/pages/Hub.jsx`.
- `src/App.jsx`.
- `src/components/BrandAtmosphere.jsx`.
- `src/styles/global.css`.
- `src/index.jsx`.

## Modelo de dados / fluxo

`state.links` contém sempre Instagram, WhatsApp e LinkedIn. A quantidade exibida em Nossos produtos considera apenas produtos habilitados. Textos e cores são lidos do estado; URLs passam por `safeUrl`.

Os destinos iniciais fornecidos pelo usuário são Instagram em `https://www.instagram.com/locytech/` e WhatsApp em `https://wa.me/5551920057268`, correspondente ao telefone +55 51 92005-7268. O LinkedIn permanece no endereço genérico `https://www.linkedin.com/`, ainda como exemplo editável. A normalização substitui apenas os endereços genéricos antigos conhecidos de Instagram e WhatsApp; outros links personalizados são preservados.

`index.jsx` monta `App` no endereço principal; somente `/admin` e `/admin/` selecionam o painel LocyView separado. Links antigos com `?preview=mobile` continuam abrindo a página normal; esse parâmetro não cria outra tela, iframe ou redirecionamento. Os parâmetros e o fragmento compartilhado permanecem na URL, e os dados públicos continuam sendo tratados por `App` e `pageState.js`.

O painel de clientes gera links de prévia no caminho `/` com um snapshot sanitizado em `#p=`. Abrir esse link não carrega os cadastros administrativos do navegador; o nome interno do cliente e `updatedAt` não entram na versão pública. O identificador cadastrado não cria uma rota curta nem uma publicação em servidor.

## Regras críticas

- Não adicionar endereço, serviços de beleza ou opções além das quatro solicitadas.
- Não exibir produtos na página inicial.
- Não inventar perfis sociais ou telefone da empresa.
- Manter os controles de personalização e compartilhamento de `App` restritos ao desenvolvimento. O painel `/admin` é uma interface separada, não um modo que reativa os controles públicos nem autenticação real.
- Manter links externos com `noopener noreferrer`.
- Preservar leitura e alvos de toque em telas estreitas.
- Manter uma única aplicação responsiva, sem redirecionar por dispositivo, depender de `userAgent` ou criar enquadramento móvel separado.

## O que revisar antes de alterar

- Verificar as quatro opções, a ordem e os endereços configurados.
- Conferir o estado sem logo, o rodapé desativado e textos longos.
- Testar a abertura do catálogo e o retorno aos links.
- Conferir a ausência dos dois controles na página inicial e no catálogo após a construção de produção, com ou sem fragmento compartilhado na URL.
- Verificar larguras de 320 e 390 pixels, tablet e computador; conferir texto legível, alvos de toque e ausência de rolagem horizontal.
- Abrir o endereço principal e o link antigo `?preview=mobile`; conferir que ambos usam a mesma aplicação, com catálogo, diálogos e rolagem natural, preservando parâmetros e fragmento.

## Código relacionado

- [Página de links e rodapé](../../src/pages/Hub.jsx)
- [Navegação e estado](../../src/App.jsx)
- [Identidade visual](../../src/components/BrandAtmosphere.jsx)
- [Validação dos links](../../src/utils/pageState.js)
- [Estilos responsivos](../../src/styles/global.css)
- [Entrada da aplicação](../../src/index.jsx)
- [Painel LocyView](../../src/admin/AdminApp.jsx)
- [Prévia dos clientes](../../src/utils/adminState.js)
