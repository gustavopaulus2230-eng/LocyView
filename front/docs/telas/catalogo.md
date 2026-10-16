# Catálogo e orçamento

## Objetivo

Apresentar os produtos digitais e preparar uma solicitação de orçamento sem simular envio real.

## Visão geral

`Products` abre somente após o clique em Nossos produtos. Os filtros Todos, Landing pages e Sites mostram contagens de produtos habilitados. Cada cartão abre `ProductDetail`, com descrição, itens incluídos e preço. O botão Solicitar orçamento abre `QuoteDialog`.

O formulário prepara uma mensagem para copiar. Um destino WhatsApp aparece somente quando há um endereço de atendimento válido configurado; um destino de e-mail depende de um link `mailto:`. Nenhuma mensagem é enviada automaticamente.

## Arquivos fonte de verdade

- `src/pages/Products.jsx`: catálogo e filtros.
- `src/App.jsx`: `ProductDetail` e `QuoteDialog`.
- `src/utils/pageState.js`: produtos iniciais e `quoteDestinations`.

## Modelo de dados / fluxo

Cada produto contém `id`, `icon`, `category`, `title`, `description`, `note`, `price`, `features` e `enabled`. Existem cinco produtos iniciais, todos com `price` igual a R$ 0,00: Landing page, Site institucional, Loja virtual, Site para profissionais e Página de links.

O valor zero substitui os preços ilustrativos anteriores e não anuncia serviço gratuito. O aviso de demonstração permanece; o valor final depende do escopo do projeto. Ao carregar dados salvos, a normalização atualiza somente os preços padrões antigos conhecidos desses produtos, preservando preços personalizados.

Os campos de orçamento ficam no estado temporário do diálogo. Fechar o diálogo descarta esses dados; `publicSnapshot` não os inclui.

## Regras críticas

- Os preços são ilustrativos e devem continuar identificados dessa forma, mesmo quando zerados; não apresentar o valor zero como oferta gratuita.
- Não exibir produtos desativados nem oferecer seu orçamento.
- Nunca confirmar envio, pagamento, contratação ou integração inexistente.
- `quoteDestinations` aceita WhatsApp com telefone válido em `wa.me` ou `api.whatsapp.com/send`.
- Não salvar nome, e-mail ou mensagem do orçamento no rascunho da página.

## O que revisar antes de alterar

- Conferir filtros e contagens, inclusive quando o catálogo está vazio.
- Validar preços, descrições e itens nos detalhes.
- Testar campos obrigatórios e o aviso de que nenhuma mensagem foi enviada.
- Verificar rolagem e fechamento dos diálogos no celular e pelo teclado.

## Código relacionado

- [Catálogo e cartões](../../src/pages/Products.jsx)
- [Detalhes e orçamento](../../src/App.jsx)
- [Produtos e destinos de contato](../../src/utils/pageState.js)
- [Diálogo nativo](../../src/components/Modal.jsx)
