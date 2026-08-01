-- CarePoint usa tabelas próprias para preservar integralmente o banco legado.
-- Esta migration não remove nem altera tabelas existentes.

CREATE TABLE IF NOT EXISTS cp_users (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(160) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'PACIENTE', 'PROFISSIONAL')),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    refresh_token_hash VARCHAR(100),
    refresh_token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cp_patients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES cp_users(id),
    nome VARCHAR(160) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE CHECK (cpf ~ '^[0-9]{11}$'),
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(15) NOT NULL CHECK (telefone ~ '^[0-9]{10,15}$'),
    endereco VARCHAR(255) NOT NULL,
    necessidades_cuidado TEXT,
    familiar_responsavel VARCHAR(160),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cp_clinics (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(160) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE CHECK (cnpj ~ '^[0-9]{14}$'),
    descricao TEXT,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(15) NOT NULL CHECK (telefone ~ '^[0-9]{10,15}$'),
    email VARCHAR(180) NOT NULL,
    imagem_url VARCHAR(500),
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cp_professionals (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(160) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE CHECK (cpf ~ '^[0-9]{11}$'),
    profissao VARCHAR(40) NOT NULL CHECK (profissao IN (
        'MEDICO', 'ENFERMEIRO', 'TECNICO_ENFERMAGEM', 'CUIDADOR', 'FISIOTERAPEUTA',
        'NUTRICIONISTA', 'PSICOLOGO', 'FONOAUDIOLOGO', 'TERAPEUTA_OCUPACIONAL'
    )),
    especialidade VARCHAR(160) NOT NULL,
    numero_registro_profissional VARCHAR(80) UNIQUE,
    foto_url VARCHAR(500),
    valor_atendimento NUMERIC(12,2) NOT NULL CHECK (valor_atendimento >= 0),
    telefone VARCHAR(15) NOT NULL CHECK (telefone ~ '^[0-9]{10,15}$'),
    email VARCHAR(180) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    clinica_id BIGINT REFERENCES cp_clinics(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cp_service_requests (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL REFERENCES cp_patients(id),
    profissional_id BIGINT NOT NULL REFERENCES cp_professionals(id),
    clinica_id BIGINT REFERENCES cp_clinics(id) ON DELETE SET NULL,
    servico_solicitado VARCHAR(200) NOT NULL,
    necessidades_informadas TEXT NOT NULL,
    data_desejada TIMESTAMPTZ NOT NULL,
    endereco_atendimento VARCHAR(255) NOT NULL,
    valor NUMERIC(12,2) NOT NULL CHECK (valor >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDENTE', 'CONFIRMADA', 'REJEITADA', 'CANCELADA', 'CONCLUIDA')),
    observacao_administrador TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS cp_reviews (
    id BIGSERIAL PRIMARY KEY,
    solicitacao_id BIGINT NOT NULL UNIQUE REFERENCES cp_service_requests(id),
    paciente_id BIGINT NOT NULL REFERENCES cp_patients(id),
    profissional_id BIGINT NOT NULL REFERENCES cp_professionals(id),
    nota SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cp_chat_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES cp_users(id) ON DELETE CASCADE,
    titulo VARCHAR(120) NOT NULL DEFAULT 'Nova conversa',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cp_chat_messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES cp_chat_conversations(id) ON DELETE CASCADE,
    role VARCHAR(12) NOT NULL CHECK (role IN ('USER', 'ASSISTANT')),
    conteudo TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cp_users_email ON cp_users(email);
CREATE INDEX IF NOT EXISTS idx_cp_patients_nome ON cp_patients(nome);
CREATE INDEX IF NOT EXISTS idx_cp_professionals_nome ON cp_professionals(nome);
CREATE INDEX IF NOT EXISTS idx_cp_professionals_profissao ON cp_professionals(profissao);
CREATE INDEX IF NOT EXISTS idx_cp_professionals_especialidade ON cp_professionals(especialidade);
CREATE INDEX IF NOT EXISTS idx_cp_professionals_clinica ON cp_professionals(clinica_id);
CREATE INDEX IF NOT EXISTS idx_cp_clinics_nome ON cp_clinics(nome);
CREATE INDEX IF NOT EXISTS idx_cp_service_requests_patient ON cp_service_requests(paciente_id);
CREATE INDEX IF NOT EXISTS idx_cp_service_requests_status ON cp_service_requests(status);
CREATE INDEX IF NOT EXISTS idx_cp_service_requests_created ON cp_service_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cp_reviews_professional ON cp_reviews(profissional_id);
CREATE INDEX IF NOT EXISTS idx_cp_chat_conversations_user ON cp_chat_conversations(user_id);

CREATE OR REPLACE FUNCTION cp_set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cp_users_updated_at ON cp_users;
CREATE TRIGGER trg_cp_users_updated_at BEFORE UPDATE ON cp_users FOR EACH ROW EXECUTE FUNCTION cp_set_updated_at();
DROP TRIGGER IF EXISTS trg_cp_patients_updated_at ON cp_patients;
CREATE TRIGGER trg_cp_patients_updated_at BEFORE UPDATE ON cp_patients FOR EACH ROW EXECUTE FUNCTION cp_set_updated_at();
DROP TRIGGER IF EXISTS trg_cp_clinics_updated_at ON cp_clinics;
CREATE TRIGGER trg_cp_clinics_updated_at BEFORE UPDATE ON cp_clinics FOR EACH ROW EXECUTE FUNCTION cp_set_updated_at();
DROP TRIGGER IF EXISTS trg_cp_professionals_updated_at ON cp_professionals;
CREATE TRIGGER trg_cp_professionals_updated_at BEFORE UPDATE ON cp_professionals FOR EACH ROW EXECUTE FUNCTION cp_set_updated_at();
DROP TRIGGER IF EXISTS trg_cp_service_requests_updated_at ON cp_service_requests;
CREATE TRIGGER trg_cp_service_requests_updated_at BEFORE UPDATE ON cp_service_requests FOR EACH ROW EXECUTE FUNCTION cp_set_updated_at();
DROP TRIGGER IF EXISTS trg_cp_chat_conversations_updated_at ON cp_chat_conversations;
CREATE TRIGGER trg_cp_chat_conversations_updated_at BEFORE UPDATE ON cp_chat_conversations FOR EACH ROW EXECUTE FUNCTION cp_set_updated_at();
