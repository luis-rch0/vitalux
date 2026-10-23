# Validação e regressão

## Resultados executados

| Verificação | Resultado | Escopo |
|---|---|---|
| Baseline frontend | 7 testes e lint aprovados | Antes das alterações |
| Frontend final | 12 testes aprovados | 7 arquivos Vitest, incluindo sessão, debounce, cache e confirmação |
| ESLint | Aprovado | Código e scripts |
| TypeScript | Aprovado | next typegen + tsc --noEmit |
| Build Next.js | Aprovado | Next 15.5.28, rotas existentes e /ajuda |
| Backend | 20 testes, 0 falhas, 0 erros | Java 25.0.5, Maven 3.9.11, Mockito como agent |
| Navegador | Aprovado | Chromium, API simulada, desktop 1440px e mobile 390px |
| Migrações antigas | V1–V4 idênticas byte a byte ao ZIP | Nova V5 aditiva |
| npm audit completo | 9 alertas; 0 críticos | Inclui ferramentas de desenvolvimento |
| npm audit produção | 0 alertas | Dependências com --omit=dev |

## Matriz de cenários

| Cenário | Pré-condição / ação | Resultado esperado | Evidência |
|---|---|---|---|
| Troca de sessão | Cache populado; limpar sessão | Dados privados e conversas removidos | session-cache.test.ts |
| Busca textual | Digitação em sequência | Atualização após 350ms sem digitar | use-debounced-value.test.tsx |
| Mutação de pedido | Atualizar solicitação | Lista, detalhe e dashboard invalidados | cache.test.ts |
| Revisão de ação | Preparar cancelamento | Não executa antes da confirmação | action-review.test.tsx e teste de navegador |
| Falha de preparação | API devolve erro | Erro exibido, sem executar | action-review.test.tsx |
| Acesso horizontal | Conversa/token de outra conta | Recurso não encontrado, sem leitura/mutação | AssistantSecurityTest |
| Token expirado | Confirmar depois do prazo | Recusa sem mutar | AssistantSecurityTest |
| Repetição | Reenviar token concluído | Retorna solicitação original | AssistantSecurityTest |
| Prompt malicioso | Pedir cancelamento em texto livre | Nenhuma ferramenta de escrita chamada | AssistantSecurityTest |
| IA sem configuração | Chave/modelo ausentes | Ajuda guiada | AssistantSecurityTest |
| Rate limit | 16 operações em um minuto | 16ª recusada; outra conta não bloqueada | AssistantSecurityTest |
| Origem / cookies | Origem indevida ou sem procedência | 403; origem autorizada e Bearer sem cookies aceitos | OriginVerificationFilterTest |
| Interface de erro | Busca retorna 503 | Mostra erro, não lista vazia; permite repetir | ui-regression.mjs |
| Mobile e tema | 390px, alternar tema, abrir chat | Sem overflow horizontal; configurações admin acessíveis | ui-regression.mjs |
| Ajuda e navegação | Abrir FAQ e links do chat | Destinos existentes e conteúdo legível | ui-regression.mjs |

## Limites

Os testes de navegador usam dados sintéticos e respostas HTTP simuladas. Não comprovam integração real frontend/backend/banco. Não houve implantação, alteração em banco do usuário, chamada autenticada ao provedor Groq nem execução do CI no GitHub. Fluxos originais têm testes parciais; CRUD completo, renovação de sessão e concorrência real devem ser validados em homologação. Não foi medida melhora de desempenho; debounce e carregamento sob demanda são mudanças de implementação, sem promessa quantitativa.

As capturas de tela foram usadas para revisão interna. O pacote entrega o script que as reproduz, sem incluir dados reais.
