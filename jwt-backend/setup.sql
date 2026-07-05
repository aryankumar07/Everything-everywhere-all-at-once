CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  token       VARCHAR(255) NOT NULL,
  family      UUID NOT NULL,
  is_used     BOOLEAN DEFAULT false,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_refresh_token ON refresh_tokens(token);
-- Index for revoking all tokens in a family
CREATE INDEX IF NOT EXISTS idx_refresh_family ON refresh_tokens(family);
-- Index for revoking all tokens for a user
CREATE INDEX IF NOT EXISTS idx_refresh_user ON refresh_tokens(user_id);
