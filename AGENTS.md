# Regras do projeto LocyTech

Este repositório contém exclusivamente o front-end React em `front/`. A adaptação foi realizada em 2026-10-16; o projeto financeiro mencionado no documento fornecido pelo usuário não foi alterado.

Antes de uma nova tarefa baseada nas regras do usuário, confirme se o trabalho é front ou back. Não implemente back-end neste repositório sem uma solicitação explícita de mudança de escopo.

Leia o código real e `front/docs/arquitetura.md` antes de alterar. Verifique duplicidade; reaproveite os componentes e utilitários existentes. Não reestruture novamente nem crie uma segunda implementação do front.

Use React, ícones SVG de `Icon`, textos diretos em português e estados acessíveis. Não use emojis. Preserve exatamente os quatro atalhos da página inicial e a separação entre rascunho local e versão pública.

Documente alterações estruturais na mesma tarefa: documentos de domínio primeiro, estas regras depois se necessário e README por último. Os documentos devem terminar com links reais para o código relacionado. Não mantenha arquivos temporários, código de teste ou logs de depuração.

O resultado de Vite em `build/` na raiz do repositório e as dependências são gerados automaticamente. Preserve o `project_id` e o acesso existente em `.openai/hosting.json`. A construção deve ser validada antes de publicar.

## Código relacionado

- [Aplicação React](front/src/App.jsx)
- [Estado e dados](front/src/utils/pageState.js)
- [Comandos do projeto](package.json)
- [Configuração de publicação](.openai/hosting.json)
