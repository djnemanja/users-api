SELECT 'CREATE DATABASE users_db_dev'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'users_db_dev')\gexec

\c users_db_dev;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "user_role_enum" AS ENUM ('admin', 'user');

CREATE TABLE IF NOT EXISTS "user" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    "first_name" character varying NOT NULL,
    "last_name" character varying NOT NULL,
    "email" character varying NOT NULL UNIQUE,
    "password" character varying NOT NULL,
    "role" "user_role_enum" DEFAULT 'user',
    "address" character varying,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "IDX_USER_EMAIL" ON "user" ("email");

INSERT INTO "user" ("first_name", "last_name", "email", "password", "role", "address")
VALUES ('Admin', 'User', 'admin@example.com', '$2a$12$.FgD164Whq1nhoTCVmBQuumEFpU8LYCeN6GrDq.GyTCpBOItYIy9W', 'admin', 'Admin Address'),
('User', 'User', 'user@example.com', '$2a$12$.FgD164Whq1nhoTCVmBQuumEFpU8LYCeN6GrDq.GyTCpBOItYIy9W', 'user', 'User Address')
ON CONFLICT (email) DO NOTHING; 