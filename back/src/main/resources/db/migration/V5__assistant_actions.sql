-- Additive migration. Existing conversations and messages are preserved.
CREATE TABLE cp_assistant_actions (
    token VARCHAR(36) PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES cp_users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('CREATE_REQUEST', 'CANCEL_REQUEST')),
    request_id BIGINT REFERENCES cp_service_requests(id),
    payload TEXT,
    quoted_value NUMERIC(12,2),
    expires_at TIMESTAMPTZ NOT NULL,
    executed_at TIMESTAMPTZ
);
CREATE INDEX idx_cp_assistant_actions_expiry ON cp_assistant_actions(expires_at);
CREATE INDEX idx_cp_chat_messages_conversation_id ON cp_chat_messages(conversation_id, id DESC);
