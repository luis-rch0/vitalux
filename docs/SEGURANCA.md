# Revisão de segurança

## Controles aplicados

- Endpoints do assistente restritos a ADMIN/PACIENTE; operações transacionais exclusivas de PACIENTE.
- Histórico, exclusão e tokens de ação filtrados pelo identificador do usuário autenticado. A role não substitui a verificação de propriedade.
- Reutilização de `CurrentUserService`, `ServiceRequestService` e regras de status existentes. O pedido nasce PENDENTE.
- DTOs com validação, tamanho de mensagem limitado a 2.000 caracteres e filtros a 160. Rate limit de 15 operações de mensagem/preparação por minuto por usuário, por instância.
- Provedor externo com URL fixa, timeout de conexão/requisição, saída em texto puro, sem ferramentas nem acesso ao banco. Pergunta enviada somente quando `useAi` é verdadeiro. Dados obtidos por consultas não são enviados ao modelo.
- Confirmações expiram em 10 minutos, são protegidas por lock no banco e são vinculadas à conta. Repetir um token já executado retorna o recurso original. Mudança de preço exige nova revisão.
- Payload de criação eliminado após execução; limpeza periódica dos rascunhos expirados. Tokens concluídos mantidos por 30 dias. Não há logs de prompts, chaves ou corpos de respostas do provedor.
- Requisições mutantes com cookies precisam de Origin autorizado ou Referer da origem autorizada; clientes sem cookies com Bearer continuam suportados. CORS e cookies existentes preservados.
- Cache privado removido ao sair, autenticar outra conta ou receber 401.
- Clínica inativa recusada também quando herdada automaticamente do profissional.

## Revisão dos controles existentes

JWT tem assinatura verificada com chave HMAC, expiração e distinção access/refresh. A configuração atual não define issuer/audience: avaliar esses campos quando houver outros emissores ou consumidores. Algoritmo e tamanho de chave continuam compatíveis com o sistema existente; não houve rotação de chaves/tokens nesta entrega. Autorização no backend, hash de senha e filtros existentes foram preservados. A revisão não constitui certificação de conformidade nem teste de penetração.

## Dependências

A auditoria inicial do npm apontou 22 alertas (3 críticos, 15 altos, 4 moderados). Next foi atualizado dentro da série 15, Vitest passou para 4.1.12 e PostCSS foi alinhado por override à versão direta corrigida. O relatório atual está em `AUDITORIA-DEPENDENCIAS.json` e seu resumo em `VALIDACAO.md`.

Os alertas residuais de ferramentas de build (Tailwind 3, globs e parsers transitivos) precisam de tratamento em atualização separada. Migrar automaticamente Tailwind para v4 ou rebaixar eslint-config-next alteraria a compatibilidade do projeto. Até a migração, o build deve processar somente código e configurações confiáveis. Isso reduz a superfície, mas não equivale a corrigir os alertas.

## Limitações e próximos controles

- Rate limit é local à instância; usar controle compartilhado se houver múltiplas réplicas.
- Sem varredura automatizada completa das dependências Maven nesta entrega.
- Sem teste em banco PostgreSQL real, concorrência real, ambiente publicado ou provedor de IA autenticado. Validar esses pontos em homologação.
- Os testes de prompt malicioso cobrem o isolamento estrutural entre ajuda e ações; não comprovam que um modelo jamais produzirá texto inadequado.
- Conversas persistem até exclusão pelo proprietário. Definir política organizacional de retenção, acessos de operação e backup antes do uso com dados reais.
- Demais formulários/transições administrativas mantêm regras originais; não foi adicionada proteção contra concorrência a toda a aplicação.
