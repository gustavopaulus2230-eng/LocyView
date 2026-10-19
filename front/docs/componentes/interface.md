# Componentes visuais e diálogos

## Objetivo

Padronizar a identidade visual inspirada na referência, os ícones e os diálogos acessíveis.

## Visão geral

`BrandAtmosphere` apresenta a logo completa e nítida sobre estrelas e grade discreta. O nome público é somente LocyTech. O efeito pontilhado foi retirado da logo para preservar a leitura do símbolo e do nome. Apenas as estrelas têm movimento suave, desativado quando o sistema solicita movimento reduzido. Sem imagem válida, aparece o monograma.

`Icon` reutiliza os desenhos SVG da interface anterior. `Modal` usa o elemento nativo `dialog`, com bloqueio da rolagem de fundo, cancelamento por Escape e fechamento por clique fora da área do diálogo.

`PageFields` oferece `BrandFields`, `ColorsFields` e `LinkFields`, reutilizados por `Editor` e pelo painel LocyView. O prefixo de identificadores mantém os rótulos associados aos campos de cada contexto sem duplicar a implementação de upload ou cores.

## Arquivos fonte de verdade

- `src/components/BrandAtmosphere.jsx`.
- `src/components/Icon.jsx`.
- `src/components/Modal.jsx`.
- `src/components/PageFields.jsx`.
- `src/styles/global.css`.
- `public/assets/locytech.png`.
- `public/assets/locytech-hd.png`.

## Modelo de dados / fluxo

`BrandAtmosphere` recebe `logo`, `name` e `backgroundColor`. A imagem usa `safeLogo`, sem amostragem ou descarte de pixels. A versão padrão tratada tem fundo preto uniforme integrado visualmente ao fundo escuro por `mix-blend-mode: screen`, sem alterar o arquivo. Em fundos claros ela aparece como uma peça escura com cantos arredondados. Logos personalizadas mantêm seu próprio arquivo e transparência sem esse efeito. Um `ResizeObserver` ajusta o canvas das estrelas ao espaço disponível e limita a escala de pixels para reduzir custo de desenho. O efeito limpa animação, observador e eventos ao desmontar.

A logo padrão está em `public/assets/locytech-hd.png`, acessada por `/assets/locytech-hd.png` para funcionar também em `/admin/`; o original foi preservado em `public/assets/locytech.png`. `safeLogo` migra os caminhos padrões relativos antigos para o novo, sem substituir logos personalizadas ou a opção de remover a logo.

### Tratamento da logo

Foi usada a ferramenta integrada de edição de imagem, sem CLI. A versão selecionada usa fundo preto opaco porque as tentativas transparentes introduziram falhas nas letras. O arquivo selecionado preserva as formas principais do pavão/circuito e o nome LocyTech, com contornos mais limpos. A imagem original continua disponível para comparação.

Pedido de tratamento da versão selecionada, traduzido para PT-BR:

> Restaurar a logo anexada com contornos mais limpos e nítidos, preservando o desenho. Reproduzir o pavão/circuito original com sete penas e o texto exato LocyTech. As letras devem ser sólidas, opacas e contínuas, sem falhas ou arranhões: Locy em azul-ciano claro e Tech em amarelo quente, mantendo formas e espaçamento. Preservar a silhueta branca do pavão, as linhas brancas dos circuitos e seus terminais circulares, a ordem das penas e as proporções. Usar preenchimentos planos, sem textura, granulação, sombra, volume ou brilho. Aplicar fundo preto uniforme #000000, opaco, inclusive nos espaços entre penas e nas aberturas naturais das letras, sem extrair o fundo. Centralizar o símbolo completo acima da palavra LocyTech, com margem uniforme de 6%, sem cortes. O único texto deve ser LocyTech, sem Monitor ou palavras adicionais.

`contrastText` escolhe preto ou branco conforme a luminância da cor configurada. Botões principais e filtros ativos usam esse contraste; a área da marca usa a cor de fundo escolhida. O painel mantém uma superfície escura para preservar a leitura dos cartões.

`Modal` recebe `children`, `className`, `labelledBy`, `onClose` e `id`. O nome acessível vem do título associado. `Icon` recebe `name`, `size`, `className` e atributos adicionais; os ícones são decorativos e os controles possuem rótulos textuais.

`BrandFields` valida e otimiza o upload com os utilitários de `pageState.js`. Remover a logo invalida operações pendentes; desmontar o componente cancela leituras em andamento para evitar aplicar uma imagem a outro cadastro. `ColorsFields` concentra as três cores e a assinatura. `LinkFields` mantém os três destinos fixos, com aviso de exemplos opcional conforme o contexto.

## Regras críticas

- Não usar a captura de referência como uma imagem de tela estática.
- Não adicionar uma biblioteca de ícones duplicada.
- Manter contraste forte, fontes grandes e controles com área de toque de pelo menos 44 pixels.
- Preservar o comportamento nativo do diálogo e `prefers-reduced-motion`.
- Não deixar eventos, animações ou bloqueio de rolagem ativos após fechar/desmontar.

## O que revisar antes de alterar

- Conferir a marca no computador e no celular, inclusive sem logo.
- Verificar foco, Escape, rolagem e clique no fundo dos diálogos.
- Conferir animação com movimento reduzido e ao trocar a logo.
- Verificar se estilos e SVGs existentes já atendem à necessidade.

## Código relacionado

- [Logo e estrelas](../../src/components/BrandAtmosphere.jsx)
- [Ícones SVG](../../src/components/Icon.jsx)
- [Diálogo nativo](../../src/components/Modal.jsx)
- [Campos compartilhados de configuração](../../src/components/PageFields.jsx)
- [Tema e responsividade](../../src/styles/global.css)
- [Logo original](../../public/assets/locytech.png)
- [Logo tratada](../../public/assets/locytech-hd.png)
