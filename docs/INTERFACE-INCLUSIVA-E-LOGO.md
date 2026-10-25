# CarePoint — logo e interface centrada nas pessoas

Base: main, commit 5dd1c5a805fbb2b80475f848164e80e598910b75 (PR #14 já incorporado).

## Alterações
- Logo original fornecido pelo usuário em `front/public/brand/carepoint-logo.png`. Componente Logo compartilhado atualizado, alcançando página inicial, acessos e áreas internas. Preservados proporção, cores e fundo preto da imagem original; não houve remoção de fundo nem redesenho da marca.
- Abertura inspirada na orientação por necessidades do care.com: opções para encontrar profissional, conhecer clínicas, acompanhar cuidado e criar perfil. As opções levam às rotas existentes, que mantêm suas regras de autenticação.
- Mensagens mais amplas para pacientes, familiares e pessoas responsáveis pelo cuidado, mantendo verde, creme e temas existentes.
- Carrossel de três imagens ilustrativas já disponíveis no projeto. Sem fotos, textos ou marca copiados do care.com. Sem estatísticas, depoimentos ou serviços fictícios.
- Carrossel sem rotação automática; rolagem por toque, botões anterior/próximo, teclado (setas, Home, End), posição anunciada e respeito à preferência de movimento reduzido.
- Não houve alterações de backend, IA, banco, dependências ou workflow. As correções anteriores permanecem na base utilizada.

## Validação realizada
- Build Next.js e checagem de tipos aprovados.
- Lint e formatação aprovados.
- 16 testes unitários aprovados.
- Regressão Chromium com APIs simuladas aprovada: desktop/celular, navegação, assistente, confirmação das ações, temas, página inicial, logo e controles de carrossel por clique/teclado. Capturas inspecionadas.
- Não houve deploy nem teste com dados de produção. Não foi executada uma auditoria completa de acessibilidade; teclado e semântica do carrossel foram verificados nos cenários descritos.
- Ambiente de teste reutilizou dependências já disponíveis. Execute `npm ci` e os checks abaixo com seu lockfile atual antes de publicar.

## Aplicar sem substituir o repositório
Extraia somente o patch para `C:\Projetos\carepoint-logo-inclusivo.patch`. No Git Bash, em `C:\Projetos\vitalux2`, confirme que não há alterações pendentes nem merge/rebase em andamento:

```bash
git status
git fetch origin
git switch -c feat/logo-interface-inclusiva origin/main
git apply --check ../carepoint-logo-inclusivo.patch
git apply ../carepoint-logo-inclusivo.patch
```

Se a verificação falhar, não force e não use `--reject`: a base pode ter sido alterada. Patch e cópia dos arquivos são duas alternativas; não aplique ambos.

```bash
cd front
npm ci
npm run format:check
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:ui
cd ..
```

Revise `git diff` e os arquivos novos. Para incluir apenas os arquivos desta entrega:

```bash
git add front/public/brand/carepoint-logo.png front/src/components/logo.tsx front/src/components/home/care-carousel.tsx front/src/app/page.tsx front/src/app/globals.css front/scripts/ui-regression.mjs docs/INTERFACE-INCLUSIVA-E-LOGO.md
git diff --cached --check
git diff --cached --stat
git commit -m "Integra logo e renova interface com carrossel acessível"
git push -u origin feat/logo-interface-inclusiva
```

Abra Pull Request para main e aguarde as verificações antes de integrar. Esta entrega precisa apenas do deploy do frontend. Reverter o commit reverte a interface; não existe migração de banco a desfazer.
