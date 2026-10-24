# Interface e assistente — atualização incremental

Base: main, commit 16f983b98dbab0483aa20a2ad264b1626dabd2fa.

## Interface
A referência enviada orientou a página pública: navegação horizontal, abertura com fotografia, destaques sobrepostos, seção institucional em duas colunas, rede de cuidado em cartões e chamada final. Mantidos verde, creme e tons de apoio do projeto. Reutilizadas as imagens existentes; nenhum número de pacientes, satisfação, serviço hospitalar ou promessa de atendimento foi inventado.

Dashboard do paciente: apresentação em duas colunas, etapas do pedido, indicadores em faixa, atalhos e informações existentes preservados. Cartões de profissionais: fotografia mais compacta e ação com menor peso visual. Estilos compartilhados preservam temas claro/escuro e acessibilidade existente.

## Assistente
- Criação de solicitação e cancelamento agora podem ocorrer dentro do painel do chat.
- Comandos locais como “agendar atendimento”, “cancelar pedido” e “meus pedidos” abrem fluxos ou consultas existentes. Esse reconhecimento é determinístico e limitado; não é um novo modelo de IA.
- Dados de atendimento são preenchidos em formulário tipado e enviados aos endpoints do CarePoint. Não são enviados à Groq pelo fluxo de ações.
- As alterações exigem preparação e confirmação via token no backend existente, com autorização e validação. Uma solicitação criada continua PENDENTE, não confirmada.
- Respostas guiadas do backend variam para dúvidas sobre perfil, status, avaliações e saudações. Perguntas não reconhecidas recebem uma explicação explícita do limite.
- A IA externa continua opcional e depende de GROQ_API_KEY, GROQ_MODEL e da opção de consentimento. Não houve teste autenticado com a Groq.
- O modelo ainda recebe a pergunta atual, não todo o histórico; interpretação livre de ferramentas e memória conversacional são uma próxima evolução, não foram implementadas nesta entrega.
- Interações locais de preparação/conclusão de tarefas não são adicionadas ao histórico de mensagens. A operação é persistida pelo backend em solicitações/ações. Fechar o chat descarta um formulário não enviado.
- O seletor de profissionais exibe a primeira página (limite solicitado: 100, sujeito ao limite do servidor); pedidos canceláveis vêm da página inicial da API. Para outros itens, continuam disponíveis as páginas completas da plataforma.

## Validação
Frontend: formatação, lint, verificação de tipos e build aprovados. 16 testes unitários aprovados. Regressão Chromium com APIs simuladas aprovada: desktop/celular, criação e cancelamento dentro do chat com confirmação explícita, navegação, erro/retry, temas e ausência de erros de página/overflow nos cenários verificados. Capturas da página inicial e do dashboard foram inspecionadas. Isso não substitui integração com o backend e banco reais.
Backend: adicionados testes JUnit para GuidedHelp. Não foi possível executar Maven/JDK 25 neste ambiente; execute `mvn verify` em back antes de publicar. Não houve migração, acesso ou modificação do banco de produção.

## Aplicação no Git Bash
Salve o patch fora do repositório. Com a árvore de trabalho limpa, atualize as referências e crie uma branch a partir da main:

```bash
git fetch origin
git switch -c feat/interface-carepoint origin/main
git apply --check ../carepoint-interface-assistente.patch
git apply ../carepoint-interface-assistente.patch
```

Se a verificação indicar conflito, não force a aplicação. A main pode ter mudado desde a base indicada acima.

Valide em front: `npm ci`, `npm run format:check`, `npm run lint`, `npm test`, `npm run build`; instale o Chromium do Playwright e execute `npm run test:ui`.
Em back, use Java 25 e execute `mvn verify`.
Revise `git diff`, faça commit dos arquivos alterados, envie a nova branch e abra Pull Request para main. Publique frontend e backend após a integração. O patch não altera variáveis de ambiente.
