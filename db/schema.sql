CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE compounds (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    smiles          TEXT NOT NULL,
    notes           TEXT,
    tags            TEXT[] NOT NULL DEFAULT '{}',
    is_favorite     BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compounds_user_id ON compounds(user_id);

-- QUERY BUAT UPDATE NOTES NANTI
-- UPDATE compounds SET content = $1, updated_at = NOW() WHERE id = $2;