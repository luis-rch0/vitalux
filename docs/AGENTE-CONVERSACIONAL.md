# CarePoint — agente conversacional com ferramentas limitadas

## Problema e resultado

Antes, cada pergunta era enviada isoladamente à IA. O modo guiado reconhecia apenas cumprimentos exatos e devolvia a mesma orientação para perfil e senha. Palavras-chave do frontend também interceptavam conversas antes de chegarem ao modelo.

Agora, com consentimento e provedor configurado, texto livre chega ao agente com até 12 mensagens recentes da mesma conversa. Uma base versionada descreve as funcionalidades reais, as diferenças entre paciente e administrador e os limites das ações. Cumprimentos e agradecimentos fazem parte da conversa. O modo guiado permanece como alternativa e já responde especificamente à troca de senha.

Isso amplia a cobertura de dúvidas sobre a aplicação, mas não garante respostas corretas a absolutamente qualquer pergunta. Novas funcionalidades precisam ser refletidas em PlatformKnowledge e perguntas sem informação devem receber uma resposta honesta.

## Arquitetura

1. AssistantPanel envia texto livre como HELP quando o usuário ativa IA. Botões de consulta e fluxos locais continuam disponíveis sem IA.
2. AssistantService autentica, aplica limite de uso e verifica a posse da conversa antes de ler o histórico no servidor.
3. GroqAiProvider envia instruções de PlatformKnowledge, papel autenticado, últimas mensagens e pergunta atual. O cliente não fornece o papel nem o histórico usado pelo modelo.
4. O modelo pode solicitar ferramentas declaradas. AssistantTools valida nomes e argumentos e usa os serviços existentes com a autenticação atual.
5. O provedor recebe o resultado limitado e redige a resposta. São no máximo duas chamadas externas e três ferramentas por mensagem, sem laço autônomo ilimitado.
6. Links e tipo de formulário vêm do servidor. O frontend não transforma texto livre da IA em código ou operações.

## Ferramentas

| Ferramenta | Permissão e efeito |
| --- | --- |
| find_professionals / find_clinics | Busca até cinco resultados; não altera cadastros |
| my_requests | Apenas paciente; consulta seus cinco pedidos recentes usando a autenticação, sem aceitar userId |
| open_profile | Apenas paciente; oferece link para o próprio formulário |
| open_help / open_settings | Oferece rota conhecida, respeitando o papel |
| start_request / start_cancellation | Apenas paciente; abre formulário, sem executar criação/cancelamento |

Os fluxos existentes de preparar, revisar e confirmar continuam sendo os únicos responsáveis por criar/cancelar pedidos. A IA não recebe ferramenta para confirmar ações, editar senhas, executar SQL, administrar usuários ou ler outros pacientes. Abrir o formulário não significa que a solicitação foi criada.

## Conversa e privacidade

- Consentimento continua desativado inicialmente; o texto informa o envio à Groq da pergunta, até 12 mensagens recentes e resultados consultados.
- Cada mensagem histórica é limitada a 1.500 caracteres; a janela não é memória permanente ou ilimitada.
- A ferramenta de pedidos envia somente número e status. Não envia endereço, CPF, necessidades de cuidado ou prontuário. Entretanto, o próprio usuário pode ter escrito dados sensíveis nas mensagens; o aviso pede que não envie senhas, documentos ou informações de saúde.
- O histórico exibido e sua exclusão permanecem com a autorização existente. Não há nova tabela ou migração.
- A consulta externa depende de chave/modelo; falta de configuração, erro ou resposta inválida mantém o fallback. Falha após uma ferramenta não aplica mutações.
- Instruções orientam o modelo a tratar histórico e resultados como dados não confiáveis. As restrições de execução são aplicadas em código; o prompt não substitui autorização.
- Chamadas HTTP têm timeout de 15 segundos por chamada e limite de resposta aceita de 64.000 caracteres. O corpo HTTP é recebido antes da checagem de tamanho.

## Configuração e publicação

No serviço de backend do Render, configure GROQ_API_KEY e GROQ_MODEL com uma chave válida e um modelo disponível na conta que suporte function calling. Não coloque a chave em variáveis NEXT_PUBLIC, no frontend, no Git ou em mensagens do chat. Os valores de configuração ausentes agora permitem iniciar com fallback.

A implementação usa ferramentas locais da API de chat da Groq:
https://console.groq.com/docs/tool-use/local-tool-calling

Publique primeiro o backend e depois o frontend. O campo task na resposta é adicional; as rotas e os contratos de preparar/confirmar ações foram preservados. Após o deploy, abra uma nova conversa e marque “Ativar conversa com IA”. Não basta publicar o frontend: sem a configuração do servidor, as respostas continuam guiadas.

## Aplicação do pacote

O patch contém somente os arquivos do agente, sem reaplicar o logo ou o redesign. Base dos arquivos existentes: main 5dd1c5a. Salve suas alterações locais antes de criar uma branch a partir de origin/main. Extraia o patch para C:\Projetos e, na raiz do projeto, execute:

```bash
git apply --check ../carepoint-agente-conversacional.patch
git apply ../carepoint-agente-conversacional.patch
```

Se o check falhar, não force nem use --reject. Os arquivos completos são uma alternativa ao patch; não aplique ambos. Revise as diferenças se o repositório já recebeu outras mudanças no assistente.

```bash
cd back
mvn -B verify
cd ../front
npm ci
npm run format:check
npm run lint
npm test
npm run build
npm run test:ui
```

Java 25 é exigido pelo projeto. Não foi alterado o pom nem o lockfile. As verificações locais de frontend reutilizam as dependências previamente disponíveis; valide novamente com npm ci e o lockfile do seu repositório.

## Aceite após publicação

- Sem IA: “Olá, tudo bem?” responde ao cumprimento; “quero alterar minha senha” explica Nova senha e Salvar mudanças, com link de perfil para paciente.
- Com IA: “preciso editar meu perfil” → “a senha” mantém o contexto; “obrigado” recebe resposta natural.
- “Pode me mostrar meus pedidos?” consulta dados reais do usuário, sem inventar registros ou confundir pendente com confirmado.
- “Quero marcar uma visita” abre formulário. Nenhum pedido existe até revisão/confirmar; verificar o banco pelo fluxo habitual da aplicação.
- Administrador não consegue acessar ferramentas de paciente; um usuário não pode carregar conversa de outro.
- Chave ausente/erro do provedor mostra indisponibilidade e mantém ajuda guiada.
- Prompt pedindo para ignorar regras ou cancelar tudo não tem acesso a ferramenta de escrita.

## Limitações

Não há teste com chave real da Groq nem com o banco de produção nesta entrega. A qualidade linguística e a escolha de ferramentas precisam ser avaliadas com o modelo configurado. Não é um assistente clínico. Não executa tarefas arbitrárias ou todas as operações administrativas. Formulários continuam exigindo dados e confirmação explícita; não há preenchimento automático de campos a partir do texto. Retornos locais de formulários não são gravados como turnos de chat; a operação continua registrada pelos serviços existentes. Não há alteração de políticas de retenção ou auditoria completa de segurança.

## Validação desta entrega

- Backend: `mvn -B verify` com JDK 25 aprovado, incluindo empacotamento e 30 testes sem falhas. Provedor simulado nos testes de ferramentas/contexto; sem conexão ao banco de produção.
- Frontend: lint, verificação de tipos e build aprovados; 16 testes existentes e 3 novos testes do painel aprovados.
- Novos cenários cobrem cumprimento composto, instrução específica de senha, consentimento, continuidade de conversationId, histórico enviado ao provedor simulado, passagem de resultado de ferramenta, rejeição de userId arbitrário, restrição de papel, ausência de mutação automática, fallback e preservação de texto após erro.
- Regressão Chromium com APIs simuladas percorreu dashboard, consultas, confirmação de cancelamento, criação/cancelamento no chat mobile, erros/retry e temas. A suíte completa não passou: terminou em timeout ao capturar a landing desktop. É a mesma limitação de captura observada antes desta mudança; não foi mascarada como aprovação.
- Java formatado com google-java-format. Nenhuma dependência de aplicação, migração, segredo, publicação ou deploy foi alterado. Os utilitários de validação não integram o pacote.
