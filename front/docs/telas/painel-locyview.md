# Painel LocyView

## Objetivo

Criar e organizar páginas de links dos clientes em um painel próprio, reaproveitando a página pública LocyTech. Esta entrega é somente front-end: os cadastros ficam neste navegador e não são enviados a um servidor.

## Visão geral

Os caminhos `/admin` e `/admin/` abrem `AdminApp`. O endereço `/` continua abrindo a página pública, com exatamente Instagram, WhatsApp, LinkedIn e Nossos produtos. O painel não acrescenta um quinto atalho à página pública.

A listagem permite pesquisar por cliente, marca ou identificador, usar os filtros Todas, Configuradas e Pendentes e abrir um formulário para criar ou editar uma página. “Configurada” significa que os campos obrigatórios passam pela validação local e há pelo menos um link válido; cadastros sem destinos ficam Pendentes. Não é um estado de publicação. Os indicadores contam somente os cadastros, as configurações válidas e os produtos presentes nos dados locais.

As abas Identidade, Aparência, Links e Produtos separam os dados do cliente, a marca, as cores, os canais de contato e o catálogo. Uma prévia visual simplificada acompanha a configuração; o botão Visualizar página abre um diálogo com o link da aplicação pública usando uma versão dos dados. Não há exclusão de cadastros de clientes nesta entrega.

Na primeira abertura, existe somente um modelo LocyTech com os dados reais já usados no site. Ele é um exemplo de configuração, não um cliente contratado ou uma publicação comprovada. O painel não inventa acessos, vendas ou métricas de desempenho. Um novo cadastro começa sem nome, logo, descrição, identificador, produtos ou destinos de contato preenchidos.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`: listagem, formulário, prévia e ações do painel.
- `src/utils/adminState.js`: cadastros locais, validação e links de prévia.
- `src/components/PageFields.jsx`: campos compartilhados de marca, cores e contatos.
- `src/components/Editor.jsx`: formulário de produto reutilizado.
- `src/styles/admin.css`: interface e adaptação do painel.
- `src/index.jsx`: seleção entre painel e página pública.

## Modelo de dados / fluxo

Cada cadastro contém `{ id, clientName, page, updatedAt }`. `page` usa o mesmo esquema versão 3 da aplicação pública: marca, textos, identificador, logo, três cores, assinatura, produtos e os três canais fixos. O nome do cliente é administrativo; ele e a data de alteração não entram no snapshot público.

O painel normaliza os dados com `migrateDefaults: false`: preços, contatos, textos e cores de um cliente não recebem migrações dos padrões antigos da LocyTech. Novos snapshots carregam `preserveConfiguredValues: true` para manter esses valores também ao abrir a página pública.

`locyview-admin:v1` armazena `{ version: 1, records }` em `localStorage`, separado do rascunho `locytech-hub:v3` do editor antigo. A ausência da chave cria o modelo LocyTech; uma lista vazia salva continua vazia, sem recriar o modelo. O limite é de 50 cadastros por navegador.

Salvar é uma ação manual. São obrigatórios nome do cliente, nome da marca e um identificador que resulte em letras ou números após a limpeza. O identificador é normalizado para letras minúsculas, números e hífens e deve ser único entre os cadastros locais. Destinos preenchidos passam por `safeUrl`; campos de contato vazios são permitidos. Erros indicam o campo e a aba correspondente. Dados persistidos malformados ou armazenamento bloqueado impedem a gravação nessa sessão, preservando o conteúdo anterior. Falta de espaço exibe aviso e mantém a edição aberta, sem apresentar sucesso de gravação.

A logo aceita PNG, JPEG ou WebP de até 1,5 MB e usa o tratamento existente em `optimizeLogo`. As três cores são principal, destaque e fundo, editáveis pelo seletor ou por HEX; uma entrada HEX incompleta volta à última cor válida ao sair do campo. O catálogo reaproveita `ProductEditor`, com até 30 produtos por página e até oito itens de descrição em cada produto; permite criar, editar, ordenar, ocultar e excluir itens. Remover um produto exige confirmação e só altera o cadastro persistido após salvar a página.

Alterações não salvas são sinalizadas no formulário. Voltar à listagem pede confirmação para descartá-las; ao fechar ou recarregar a aba, o navegador também recebe o aviso de edição pendente.

`clientPreviewUrl` usa a origem atual, o caminho `/` e um fragmento `#p=` com o snapshot público sanitizado. Parâmetros e caminhos administrativos são removidos. O identificador não cria uma rota curta como `/cliente`; não existe cadastro de domínio, publicação em servidor ou sincronização entre aparelhos nesta versão.

O snapshot contém a versão gerada naquele momento. Salvar alterações locais não atualiza links antigos. Não existe revogação de snapshots já compartilhados. Não incluir dados sigilosos nos textos, produtos, imagens ou contatos: os dados públicos estão contidos no próprio link.

## Regras críticas

- Manter o painel separado de `/`, sem modificar os quatro atalhos do site público.
- Não simular login, autenticação, API, servidor, cadastro centralizado ou publicação de páginas.
- `/admin` é apenas uma rota de interface e pode ser acessada por quem abrir o front; não é uma barreira de segurança.
- Não enviar dados para um servidor nem solicitar senhas ou tokens nesta implementação.
- Não misturar cadastros administrativos com o rascunho antigo, o orçamento ou o snapshot público.
- Preservar os dados abertos quando houver falha ao salvar e informar que o armazenamento é local ao navegador.
- Manter leitura, controles acessíveis e rolagem natural em celular e computador, sem detectar o aparelho por `userAgent`.

## O que revisar antes de alterar

- Abrir `/`, `/admin` e `/admin/` diretamente, inclusive após recarregar.
- Verificar o modelo inicial, criar cadastro vazio, editar, pesquisar e filtrar a listagem.
- Testar campos obrigatórios, identificadores repetidos e URLs inválidas com foco no erro correspondente.
- Conferir upload e remoção de logo, cores, contatos vazios e CRUD de produtos.
- Salvar, recarregar e verificar que os cadastros persistem somente no navegador atual.
- Verificar lista vazia salva, dados locais inválidos, armazenamento bloqueado e quota esgotada.
- Gerar uma prévia, confirmar o caminho `/` e conferir que o snapshot não contém nome administrativo ou data de alteração.
- Testar celular e computador sem rolagem horizontal, inclusive formulários, abas e diálogos.
- Confirmar que os controles antigos de edição continuam restritos ao desenvolvimento fora do modo público.

## Código relacionado

- [Painel de clientes](../../src/admin/AdminApp.jsx)
- [Estado administrativo e validação](../../src/utils/adminState.js)
- [Campos reutilizados](../../src/components/PageFields.jsx)
- [Formulário de produto](../../src/components/Editor.jsx)
- [Esquema e snapshot público](../../src/utils/pageState.js)
- [Estilos do painel](../../src/styles/admin.css)
- [Seleção da aplicação por caminho](../../src/index.jsx)
