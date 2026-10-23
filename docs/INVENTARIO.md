# Inventário funcional e decisões

| Função | Baseline | Evidência | Entrega / prioridade |
|---|---|---|---|
| Autenticação/cadastro | Presente | auth-provider, AuthService | Preservada; cache isolado — P0 |
| Profissionais/clínicas | Presente | Rotas e services | Tipagem, feedback e debounce — P1 |
| Solicitações/avaliações | Presente | ServiceRequestService | Preservadas; cache coordenado e clínica ativa — P0 |
| Administração | Presente | /admin/* | Preservada; configurações acessíveis no celular — P1 |
| Chat atual | Ausente | Sem controller/UI no ZIP atual | Novo módulo assistant — P1 |
| Chat antigo | Presente no histórico | 91cdb32, AIOrchestratorService | Referência de Q&A; adaptado aos serviços atuais |
| Conversas SQL | Estrutura existente | V1 cp_chat_* | Aproveitada sem modificar V1 |
| Ajuda | Parcial | Link #suporte sem destino | Central /ajuda + assistente — P1 |
| Tema/idiomas/acessibilidade | Presente | Providers e painel | Mantidos e testados parcialmente |
| Notificações/lembretes | Preferências locais | Configurações grava localStorage | Mantidas; não constituem entrega de notificações reais |

## Ajustes em relação ao planejamento inicial

1. O assistente antigo era Q&A. A versão entregue acrescenta consultas explícitas e ações estruturadas nos formulários; não promete um agente autônomo de linguagem natural.
2. A ajuda guiada funciona sem provedor. A IA externa é opcional, com consentimento e contexto mínimo.
3. A arquitetura existente em camadas foi preservada. O módulo assistant, os contratos de entrada, os utilitários de sessão/cache e os componentes de erro são fronteiras novas. A fachada carepointService continua existindo para compatibilidade.
4. O frontend foi formatado com Prettier. Novos arquivos Java foram formatados com google-java-format. Formatação não é apresentada como otimização de desempenho.
5. A paleta/tipografia e os componentes compartilhados foram atualizados; as mudanças de composição se concentram na página inicial, dashboard do paciente, navegação, ajuda e chat. Não houve reescrita integral de todas as telas.
6. Foram feitas atualizações de segurança compatíveis; migração Tailwind 4 fica separada por exigir revisão visual e de build adicional.

## Reversibilidade

Rotas existentes mantidas. Novos endpoints em /api/assistant. V5 adiciona tabela de ações e índice de mensagens; nenhuma exclusão de dados de pacientes. Reverter o código sem remover a V5 evita perda de histórico. Para retirada completa do módulo, planejar migração futura e política de retenção; não editar migrações já aplicadas.
