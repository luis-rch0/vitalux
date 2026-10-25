# Evolução CarePoint

## Baseline e escopo
Fonte: carepoint(3).zip, HEAD d06ff6c. Diferenças iniciais do Git são CRLF (diff --ignore-space-at-eol vazio). Funcionalidades preservadas: autenticação, cadastro, profissionais, clínicas, solicitações, administração, avaliações, idiomas, temas e acessibilidade.

## Decisões
Aplicação Spring Boot modular, Next.js existente. Assistente isolado; provedor externo opcional; navegação e consultas autorizadas continuam funcionando sem chave. Na evolução conversacional, com consentimento, o modelo recebe a pergunta, até 12 mensagens recentes e resultados mínimos das ferramentas (incluindo números/status de pedidos próprios). Ver AGENTE-CONVERSACIONAL.md para fluxo de dados e limites. Ações usam serviços existentes e confirmação explícita. Tabelas de chat da V1 aproveitadas; extensões somente em V5. Nenhuma migração existente alterada.

## Fluxo
Interface → cliente HTTP → controller → serviços autorizados → repositories. Assistente consulta serviços existentes; modelo recebe contexto limitado e pode solicitar ferramentas autorizadas de consulta e abertura de formulários. Não recebe ferramentas de execução transacional; as ações continuam exigindo confirmação.

## Design
Verde floresta #173f35, marfim #f6f4ee, verde claro #e6eee8, argila #b36946. Tipografia editorial serifada nos títulos principais, sans-serif em formulários. Ritmo 4/8/16/24/32, cantos 12/20, sombras discretas. Navegação persistente e painel de assistência. Temas claro/escuro, foco e reduced-motion preservados.

## Ordem
1. Cache de sessão, contratos e feedback de erro.
2. Módulo de conversas, orientação, consultas e ações confirmadas.
3. Componentes visuais, dashboard, navegação e ajuda.
4. Testes, build, validação visual e documentação.

## Riscos
Sem acesso ao banco de produção; migrações exigem backup antes de aplicar. IA depende de chave e modelo configurados pelo operador. Rate limit local serve uma instância; múltiplas réplicas exigem controle compartilhado. Testes com mocks não substituem validação integrada em homologação.
