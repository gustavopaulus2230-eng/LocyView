# Componentes visuais e diálogos

## Objetivo

Padronizar a identidade visual inspirada na referência, os ícones e os diálogos acessíveis.

## Visão geral

`BrandAtmosphere` desenha a logo original em partículas sobre estrelas e grade discreta. O movimento reage ao ponteiro e é desativado quando o sistema solicita movimento reduzido. A logo padrão usa apenas o símbolo da imagem original, acompanhado de MONITOR e LOCYTECH. Logos personalizadas são processadas separadamente; sem imagem válida, aparece o monograma.

`Icon` reutiliza os desenhos SVG da interface anterior. `Modal` usa o elemento nativo `dialog`, com bloqueio da rolagem de fundo, cancelamento por Escape e fechamento por clique fora da área do diálogo.

## Arquivos fonte de verdade

- `src/components/BrandAtmosphere.jsx`.
- `src/components/Icon.jsx`.
- `src/components/Modal.jsx`.
- `src/styles/global.css`.
- `public/assets/locytech.png`.

## Modelo de dados / fluxo

`BrandAtmosphere` recebe `logo`, `name`, `primaryColor`, `accentColor` e `backgroundColor`. Um `ResizeObserver` ajusta o canvas ao espaço disponível e limita a escala de pixels para reduzir custo de desenho. O efeito limpa animação, observador e eventos ao desmontar. Pixels brancos são descartados somente no arquivo padrão; logos personalizadas transparentes preservam seus pixels claros.

`contrastText` escolhe preto ou branco conforme a luminância da cor configurada. Botões principais e filtros ativos usam esse contraste; a área da marca usa a cor de fundo escolhida. O painel mantém uma superfície escura para preservar a leitura dos cartões.

`Modal` recebe `children`, `className`, `labelledBy`, `onClose` e `id`. O nome acessível vem do título associado. `Icon` recebe `name`, `size`, `className` e atributos adicionais; os ícones são decorativos e os controles possuem rótulos textuais.

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

- [Marca em partículas](../../src/components/BrandAtmosphere.jsx)
- [Ícones SVG](../../src/components/Icon.jsx)
- [Diálogo nativo](../../src/components/Modal.jsx)
- [Tema e responsividade](../../src/styles/global.css)
- [Logo original](../../public/assets/locytech.png)
