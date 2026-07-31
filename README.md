# CarePoint

O CarePoint é uma plataforma para atendimento domiciliar em saúde. Ela conecta pacientes e familiares a clínicas e profissionais, permitindo pesquisar opções, solicitar atendimento e acompanhar cada etapa da solicitação.

> **Marca do produto:** CarePoint. **Vitalux** é a equipe responsável pelo seu desenvolvimento.

## Objetivo e fluxos

O MVP possui os perfis `PACIENTE` e `ADMIN`.

- **Paciente:** cria conta, faz login, pesquisa profissionais e clínicas, aplica filtros, solicita atendimento domiciliar, acompanha o status e avalia atendimentos concluídos.
- **Administrador:** usa um painel próprio para consultar indicadores e gráficos, listar usuários, profissionais e clínicas, além de confirmar, rejeitar ou concluir solicitações.

A arquitetura já prevê a role `PROFISSIONAL`, sem expor um painel próprio no MVP.

O dashboard administrativo apresenta totais de usuários, profissionais, clínicas, solicitações, agendamentos e consultas concluídas; também exibe a evolução mensal dos cadastros e a distribuição dos atendimentos por status.

## Equipe Vitalux

- Gabriel Quinelato
- João Francisco
- Kayke Cruz
- Luis Eduardo Rocha
- Rafael Felipe

**Docentes:** Debora Souza e Felippe Nascimento.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | Next.js 15, TypeScript, App Router, Tailwind CSS, React Hook Form, Zod, TanStack Query, fetch, Lucide, Sonner e ESLint |
| Backend | Java 21, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, JWT, BCrypt, Jakarta Validation, Flyway e Swagger/OpenAPI |

## Estrutura

```text
CarePoint/
├── back/                 # API Spring Boot
│   ├── src/main/java/    # controller, service, repository, entity, dto, security
│   └── src/main/resources/db/migration/
├── front/                # Next.js 15
│   └── src/              # app, components, features, providers, schemas, services
├── compose.yml          # PostgreSQL local persistente para desenvolvimento
├── render.yaml           # serviço Render
└── README.md
```

## Configuração local

### Pré-requisitos

- Java 21 e Maven 3.9+
- Node.js 20+
- Docker Desktop com WSL 2, ou PostgreSQL 15+ instalado separadamente

### PostgreSQL local com Docker

Na raiz do projeto, crie os arquivos locais de configuração:

```powershell
Copy-Item back\.env.example back\.env
Copy-Item front\.env.example front\.env.local
```

Edite `back/.env` e substitua todos os valores de exemplo. Use a mesma senha em
`POSTGRES_PASSWORD` e `DATABASE_PASSWORD`, pois o container e o Spring Boot precisam
se conectar com a mesma credencial. Depois execute:

```bash
docker compose up -d postgres
docker compose ps
```

O banco fica disponível em `localhost:5432` e os dados são preservados no volume `carepoint-postgres-data`. Para parar o banco sem apagar os dados, use `docker compose stop postgres`.

### Backend

```bash
cd back
mvn spring-boot:run
```

O Spring Boot carrega o arquivo local `back/.env` e executa as migrations Flyway automaticamente ao iniciar. A API fica em `http://localhost:8080`.

### Frontend

```bash
cd front
npm ci
npm run dev
```

A aplicação fica em `http://localhost:3000`.

Os portais de acesso são independentes:

- Paciente: `http://localhost:3000/login/paciente`
- Administrador: `http://localhost:3000/login/admin`

Cada portal redireciona para seu painel específico, e o backend rejeita o login quando a role da conta não corresponde ao portal selecionado.

### Acessibilidade

O botão flutuante de acessibilidade está disponível em todas as páginas e permite escolher texto normal, grande ou muito grande, ativar alto contraste, reduzir animações e restaurar as preferências. As escolhas ficam salvas no navegador. A interface também possui link para pular ao conteúdo principal, foco de teclado reforçado, labels e textos alternativos nas imagens.

A interface principal também pode ser usada em português ou inglês. O idioma é escolhido em **Configurações**, fica salvo no navegador e atualiza menus, autenticação, marketplace, solicitações, perfis e a página “Sobre nós”. Todas as animações novas respeitam tanto a preferência do sistema (`prefers-reduced-motion`) quanto a opção “Reduzir animações” do painel de acessibilidade.

## Variáveis de ambiente

### `back/.env`

| Variável | Obrigatória | Uso |
| --- | --- | --- |
| `DATABASE_URL` | Sim | URL JDBC PostgreSQL, por exemplo `jdbc:postgresql://host:5432/carepoint` |
| `DATABASE_USERNAME` | Sim | Usuário do banco |
| `DATABASE_PASSWORD` | Sim | Senha do banco |
| `JWT_SECRET` | Sim | Segredo aleatório com pelo menos 32 caracteres |
| `JWT_ACCESS_EXPIRATION` | Sim | Expiração do access token em ms |
| `JWT_REFRESH_EXPIRATION` | Sim | Expiração do refresh token em ms |
| `ADMIN_INITIAL_PASSWORD` | Sim no primeiro boot | Senha do administrador inicial Kayke |
| `FRONTEND_URL` | Sim | Origem permitida pelo CORS; múltiplas origens separadas por vírgula |
| `COOKIE_SECURE` | Sim em produção | `true` em HTTPS; habilita cookie `SameSite=None` |
| `SPRING_PROFILES_ACTIVE` | Não | Perfil ativo, por exemplo `dev` |
| `APP_SEED_DEMO_DATA` | Não | `true` somente em desenvolvimento para carregar dados demonstrativos idempotentes |

### `front/.env.local`

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL pública da API com o sufixo `/api` |

Nenhum segredo deve ser colocado em variáveis `NEXT_PUBLIC_*`.

## Banco e migrations

O Hibernate usa obrigatoriamente `ddl-auto=validate`; ele não cria nem apaga a estrutura do banco.

| Migration | Finalidade |
| --- | --- |
| `V1__create_carepoint_schema.sql` | Cria tabelas `cp_` para usuários, pacientes, clínicas, profissionais, solicitações, avaliações e chat, com índices e timestamps. |
| `V2__import_legacy_clinics_and_professionals.sql` | Importação idempotente e aditiva de clínicas e profissionais legados quando os campos mínimos existem. |
| `V3__document_legacy_patient_preservation.sql` | Documenta a preservação de dados de pacientes legados: senhas antigas não são migradas automaticamente por não atenderem BCrypt. |

As tabelas legadas nunca são apagadas. As novas tabelas possuem prefixo `cp_`, evitando colisões e preservando a base existente. Para migrar contas antigas, implemente um fluxo administrativo de redefinição de senha; não copie hashes ou senhas legadas diretamente.

### Modelo principal

```text
cp_users 1──0..1 cp_patients
cp_clinics 1──N cp_professionals
cp_patients 1──N cp_service_requests N──1 cp_professionals
cp_service_requests 1──0..1 cp_reviews
```

O antigo recurso de assistente por IA foi removido do backend e do frontend. As tabelas históricas de conversa criadas por migrations já aplicadas permanecem sem uso para evitar perda de dados e alteração de checksums do Flyway.

## Segurança

- Senhas sempre usam BCrypt e nunca são serializadas.
- Access e refresh tokens são cookies HTTP-only; o frontend não usa `localStorage` para tokens.
- Refresh token é rotacionado, armazenado como hash e revogado no logout.
- Endpoints administrativos exigem `ROLE_ADMIN`; além disso, o backend valida se a role autenticada corresponde ao portal de login selecionado.
- Há rate limit básico de login, CORS por variável de ambiente e validação de origem para operações com efeito colateral.
- O administrador inicial só é criado quando `ADMIN_INITIAL_PASSWORD` estiver definido. O e-mail é `kaykesslac@gmail.com`; a senha nunca fica em código, migration ou documentação.

## API e Swagger

Swagger: `http://localhost:8080/swagger-ui.html`  
OpenAPI JSON: `http://localhost:8080/v3/api-docs`

Principais endpoints:

| Área | Endpoints |
| --- | --- |
| Autenticação | `POST /api/auth/cadastro`, `/login`, `/refresh`, `/logout`; `GET /api/auth/me` |
| Marketplace | `GET /api/profissionais`, `GET /api/profissionais/especialidades`, `GET /api/profissionais/{id}`, `GET /api/clinicas`, `GET /api/clinicas/{id}` |
| Paciente | `GET/PATCH /api/pacientes/me`, `GET /api/paciente/dashboard` |
| Solicitações | `POST /api/solicitacoes`, `GET /api/solicitacoes/minhas`, `GET /api/solicitacoes/{id}`, `PATCH /api/solicitacoes/{id}/cancelar`, `POST /api/solicitacoes/{id}/avaliacao` |
| Administração | `GET /api/admin/dashboard`, CRUD de `/api/admin/profissionais` e `/api/admin/clinicas`, `GET /api/admin/pacientes`, gestão de `/api/admin/solicitacoes` |

As imagens demonstrativas de profissionais e clínicas ficam em `front/public/images`. Elas foram geradas exclusivamente para o CarePoint e não dependem de URLs ou bancos de imagens externos.

Status válidos de solicitação: `PENDENTE`, `CONFIRMADA`, `REJEITADA`, `CANCELADA`, `CONCLUIDA`. O backend impõe as transições: confirmar/rejeitar apenas pendentes; concluir apenas confirmadas; cancelar apenas pendentes ou confirmadas.

## Testes e qualidade

```bash
# backend
cd back
mvn test
mvn package

# frontend
cd front
npm run lint
npm run test
npm run build
```

Os testes backend cobrem a validade/tipagem de JWT e transições críticas da máquina de estados. Os testes frontend cobrem schemas de login e chamadas seguras para login, criação de solicitação e confirmação administrativa.

## Deploy

### Render — backend

O arquivo [`render.yaml`](render.yaml) aponta para `back/Dockerfile`. Crie o serviço pelo Blueprint ou configure manualmente:

- **Root Directory:** `back`
- **Runtime:** Docker
- **Health Check:** `/v3/api-docs`
- Configure todas as variáveis de `back/.env.example` no painel do Render.
- Use o JDBC URL do PostgreSQL existente; nunca habilite `ddl-auto=create`.
- Em produção: `COOKIE_SECURE=true` e `FRONTEND_URL=https://<seu-projeto>.vercel.app`.

O Docker build executa `mvn package`; o Flyway roda no início do container. Para alterar a senha do administrador inicial depois do primeiro boot, faça isso por um fluxo administrativo/rotina controlada — mudar apenas a variável não substitui uma conta já criada.

### Vercel — frontend

- **Root Directory:** `front`
- **Build Command:** `npm run build`
- **Install Command:** `npm ci`
- Defina `NEXT_PUBLIC_API_URL=https://<sua-api>.onrender.com/api`.
- Atualize `FRONTEND_URL` no backend com a URL definitiva da Vercel para CORS e cookies.

## Dados demonstrativos

O carregador opcional inclui 6 clínicas e 18 profissionais demonstrativos, distribuídos por todas as profissões do MVP. As especialidades são expostas dinamicamente pela API e usadas diretamente no filtro do frontend; por exemplo, profissionais de fisioterapia tornam a opção **Fisioterapeuta** disponível.

Para carregar esses registros no PostgreSQL local, use `APP_SEED_DEMO_DATA=true` em `back/.env` e reinicie o backend. O processo é idempotente: CPF e CNPJ identificam os registros, portanto reinicializações não criam duplicatas e nenhum dado existente é removido ou sobrescrito. Em produção, mantenha obrigatoriamente `APP_SEED_DEMO_DATA=false`.

As fotos e fachadas demonstrativas ficam em `front/public/images/profissionais` e `front/public/images/clinicas`. São assets originais gerados para o projeto, otimizados em WebP e sem dependência de URLs externas.
