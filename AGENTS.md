# Regras do projeto LocyTech

Este repositório contém exclusivamente o front-end React em `front/`: o site público LocyTech em `/` e o painel local LocyView em `/admin` e `/admin/`. A adaptação inicial foi realizada em 2026-10-16; o projeto financeiro mencionado no documento fornecido pelo usuário não foi alterado.

Antes de uma nova tarefa baseada nas regras do usuário, confirme se o trabalho é front ou back. Não implemente back-end neste repositório sem uma solicitação explícita de mudança de escopo.

Leia o código real e `front/docs/arquitetura.md` antes de alterar. Verifique duplicidade; reaproveite os componentes e utilitários existentes. Não reestruture novamente nem crie uma segunda implementação do front.

Use React, ícones SVG de `Icon`, textos diretos em português e estados acessíveis. Não use emojis. Preserve exatamente os quatro atalhos da página inicial e a separação entre rascunho local e versão pública.

Reaproveite `PageFields`, `ProductEditor` e os utilitários de `pageState.js` no painel. O armazenamento administrativo `locyview-admin:v1` é independente do rascunho `locytech-hub:v3`. Não misture dados internos do cliente ou orçamento com snapshots públicos. O identificador do cliente não cria uma rota curta; links `#p=` são versões dos dados e não uma publicação sincronizada.

O painel é somente front-end, sem login, autenticação, API ou banco de dados. Não trate `/admin` como uma proteção de acesso nem apresente gravação local como envio para servidor. Preserve os controles antigos de edição de `App` restritos ao desenvolvimento fora do modo público; o painel separado não altera essa regra. Não adicione métricas ou dados de clientes fictícios como se fossem reais.

Documente alterações estruturais na mesma tarefa: documentos de domínio primeiro, estas regras depois se necessário e README por último. Os documentos devem terminar com links reais para o código relacionado. Não mantenha arquivos temporários, código de teste ou logs de depuração.

O resultado de Vite em `build/` na raiz do repositório e as dependências são gerados automaticamente. Preserve o `project_id` e o acesso existente em `.openai/hosting.json`. A construção deve ser validada antes de publicar.

## Código relacionado

- [Aplicação React](front/src/App.jsx)
- [Estado e dados](front/src/utils/pageState.js)
- [Painel LocyView](front/src/admin/AdminApp.jsx)
- [Cadastros locais](front/src/utils/adminState.js)
- [Campos compartilhados](front/src/components/PageFields.jsx)
- [Comandos do projeto](package.json)
- [Configuração de publicação](.openai/hosting.json)
