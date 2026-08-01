-- Importação idempotente e somente aditiva de tabelas legadas conhecidas.
-- Dados de pacientes não são convertidos automaticamente porque versões antigas
-- guardavam senhas sem BCrypt; as tabelas originais permanecem intactas.
DO $$
BEGIN
    IF to_regclass('public.clinica') IS NOT NULL THEN
        INSERT INTO cp_clinics (nome, cnpj, descricao, endereco, telefone, email, ativo)
        SELECT
            NULLIF(BTRIM(data ->> 'nome'), ''),
            REGEXP_REPLACE(COALESCE(data ->> 'cnpj', ''), '\D', '', 'g'),
            NULL,
            COALESCE(NULLIF(BTRIM(data ->> 'endereco'), ''), 'Endereço não informado'),
            COALESCE(NULLIF(REGEXP_REPLACE(COALESCE(data ->> 'telefone', data ->> 'numerotelefone', ''), '\D', '', 'g'), ''), '0000000000'),
            COALESCE(NULLIF(LOWER(BTRIM(data ->> 'email')), ''), 'contato+' || REGEXP_REPLACE(COALESCE(data ->> 'cnpj', ''), '\D', '', 'g') || '@legado.carepoint.local'),
            COALESCE((data ->> 'ativo')::BOOLEAN, TRUE)
        FROM (SELECT to_jsonb(c) AS data FROM clinica c) legacy
        WHERE NULLIF(BTRIM(data ->> 'nome'), '') IS NOT NULL
          AND LENGTH(REGEXP_REPLACE(COALESCE(data ->> 'cnpj', ''), '\D', '', 'g')) = 14
        ON CONFLICT (cnpj) DO NOTHING;
    END IF;

    IF to_regclass('public.listagem_medica') IS NOT NULL THEN
        INSERT INTO cp_professionals (
            nome, cpf, profissao, especialidade, numero_registro_profissional,
            valor_atendimento, telefone, email, descricao, ativo
        )
        SELECT
            NULLIF(BTRIM(data ->> 'nome'), ''),
            REGEXP_REPLACE(COALESCE(data ->> 'cpf', ''), '\D', '', 'g'),
            'MEDICO',
            COALESCE(NULLIF(BTRIM(data ->> 'especialidade'), ''), 'Clínica geral'),
            NULLIF(BTRIM(COALESCE(data ->> 'crm', data ->> 'numero_registro_profissional')), ''),
            0,
            COALESCE(NULLIF(REGEXP_REPLACE(COALESCE(data ->> 'telefone', ''), '\D', '', 'g'), ''), '0000000000'),
            COALESCE(NULLIF(LOWER(BTRIM(data ->> 'email')), ''), 'profissional+' || REGEXP_REPLACE(COALESCE(data ->> 'cpf', ''), '\D', '', 'g') || '@legado.carepoint.local'),
            'Registro importado da base legada.',
            COALESCE((data ->> 'ativo')::BOOLEAN, TRUE)
        FROM (SELECT to_jsonb(m) AS data FROM listagem_medica m) legacy
        WHERE NULLIF(BTRIM(data ->> 'nome'), '') IS NOT NULL
          AND LENGTH(REGEXP_REPLACE(COALESCE(data ->> 'cpf', ''), '\D', '', 'g')) = 11
        ON CONFLICT (cpf) DO NOTHING;
    END IF;
END $$;
