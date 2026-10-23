# CarePoint — cuidado, assistência e organização

Evolução do `carepoint(3).zip`, preservando as rotas e fluxos existentes. Consulte `docs/IMPLEMENTACAO.md`, `docs/VALIDACAO.md` e `docs/SEGURANCA.md` para escopo, decisões e limites da validação.

## O que mudou

- Assistente autenticado com orientação, busca de profissionais/clínicas, consulta dos próprios pedidos, histórico e exclusão de conversas.
- Ajuda guiada disponível sem chave de IA. Respostas de IA externas são opcionais e exigem ativação pelo usuário no painel.
- Revisão de criação e cancelamento de solicitações, seguida de confirmação explícita. Tokens vinculados ao usuário, validade de 10 minutos, bloqueio transacional e proteção de repetição.
- Central `/ajuda`, ligada às configurações e ao menu. Interface em verde floresta e marfim, títulos editoriais, foco na continuidade do cuidado e acesso mobile às configurações administrativas.
- Contratos TypeScript explícitos, formatação automática, debounce e feedback de falhas de busca, limpeza de cache privado na troca de sessão, invalidação coordenada de solicitações.
- Validação de clínica ativa, proteção adicional de origem para operações com cookies, testes e CI.

## Requisitos

Node.js 22.12 ou superior; Java 25; Maven 3.9; PostgreSQL. Docker é opcional para o banco local. Use `npm ci` para reproduzir as versões do lockfile.

## Configuração local

1. Copie `back/.env.example` para `back/.env`. Configure banco, senhas, `JWT_SECRET` aleatório e `FRONTEND_URL`. Não versione `.env`.
2. Para usar PostgreSQL local com Docker, execute **na raiz**:

```sh
docker compose --env-file back/.env up -d
```

O exemplo usa banco `carepoint` e porta 5432. As variáveis `DATABASE_*` alimentam a aplicação; o Compose converte usuário/senha para as variáveis `POSTGRES_*` do container. Em um volume já existente, alterar a variável não altera automaticamente a senha do banco.

3. Execute o backend:

```sh
cd back
mvn test
mvn spring-boot:run
```

O Spring carrega `back/.env` quando iniciado dentro dessa pasta. Flyway executa as migrações; faça backup do banco antes de aplicar em um ambiente com dados. A V5 é aditiva; V1–V4 foram preservadas byte a byte.

4. Em outro terminal, copie `front/.env.example` para `front/.env.local`. Execute:

```sh
cd front
npm ci
npm run dev
```

Acesse `http://localhost:3000`. O Next encaminha `/api` para `BACKEND_URL`. A origem do navegador precisa estar em `FRONTEND_URL` no backend. Em produção, use HTTPS e `COOKIE_SECURE=true`.

No PowerShell, use `Copy-Item back/.env.example back/.env` e `Copy-Item front/.env.example front/.env.local`. No Bash, use `cp` nos mesmos caminhos.

## Como usar o assistente

Entre como paciente ou administrador e clique em **CarePoint**, no botão de conversa. As consultas usam os botões Profissionais, Clínicas e Meus pedidos (este último apenas para pacientes). O campo de busca filtra nome/especialidade ou nome/endereço conforme a consulta.

O texto livre oferece ajuda guiada. Para respostas geradas, configure no backend `GROQ_API_KEY` e `GROQ_MODEL` com um modelo disponível na sua conta e ative **Usar IA externa para dúvidas gerais** no painel. Nenhuma chave é incluída no projeto. Falhas/ausência de configuração retornam orientação guiada. A integração real com Groq não foi exercitada com credenciais nesta entrega.

Para **criar um pedido**, abra um profissional, preencha o formulário e use **Revisar com o assistente**. O botão aparece após informar uma data válida. Confira o resumo e confirme. Para **cancelar**, abra uma solicitação pendente/confirmada e use a revisão. O fluxo convencional também continua disponível.

As ações são estruturadas e revisadas nos formulários. O modelo de linguagem não executa comandos, não decide permissões e não recebe registros do paciente. Texto livre não substitui a seleção explícita das consultas nem os formulários. A IA recebe apenas a pergunta atual com instruções de ajuda; o histórico salvo é exibido ao usuário e não é enviado automaticamente ao provedor.

## Validação reproduzível

No frontend:

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:ui
npm audit
```

`test:ui` inicia a build na porta 3100, usa uma API simulada e encerra o servidor. Ele exige `npm run build` antes. É possível mudar a porta com `TEST_PORT`. Capturas ficam em `/tmp/carepoint-ui` por padrão; ajuste `TEST_OUTPUT` para um caminho local (no Windows, por exemplo `$env:TEST_OUTPUT="$pwd/test-results"`). Não use dados reais nesse teste. `CHROMIUM_EXECUTABLE` permite indicar um Chromium já instalado.

No backend:

```sh
mvn test
mvn package
```

O `pom.xml` configura Mockito como Java agent para evitar dependência de autoanexação no Java 25. A automação em `.github/workflows/quality.yml` reproduz os principais checks. O workflow foi adicionado, mas não foi executado no GitHub nesta entrega.

## Implantação e reversão

Valide primeiro em homologação com banco de teste e backup. Aplique a V5 com Flyway, publique o backend e depois o frontend. Um rollback do código pode manter a tabela/índice adicionais; não apague tabelas existentes nem altere checksums de migrações. Rascunhos expirados são limpos a cada hora; ações executadas mantêm o identificador para repetição por 30 dias, sem o payload pessoal. Conversas podem ser excluídas pelo proprietário.

O pacote contém código, ativos, testes e documentação. Dependências instaladas, builds, histórico `.git` e arquivos `.env` reais não fazem parte da entrega. Aplique os arquivos em uma branch do seu repositório para preservar o histórico da equipe.
