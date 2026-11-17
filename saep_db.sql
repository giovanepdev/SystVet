-- =====================================================
-- SAEP - Sistema de Clínica Veterinária
-- Script de criação e população do banco de dados (SQLite)
-- O sistema executa este script automaticamente na 1ª execução.
-- =====================================================

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS agendamentos;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS tutores;
DROP TABLE IF EXISTS usuarios;

-- -----------------------------------------------------
-- Usuários do sistema (login). Senha armazenada com hash bcrypt.
-- -----------------------------------------------------
CREATE TABLE usuarios (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(120) NOT NULL UNIQUE,
  senha_hash VARCHAR(100) NOT NULL,
  criado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Tutores (donos dos pets)
-- -----------------------------------------------------
CREATE TABLE tutores (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  nome     VARCHAR(100) NOT NULL,
  cpf      VARCHAR(200) NOT NULL,      -- criptografado (AES-256-GCM): LGPD
  cpf_hash CHAR(64) NOT NULL UNIQUE,   -- hash do CPF: garante CPF único sem expor o número
  telefone VARCHAR(20) NOT NULL,
  email    VARCHAR(120),
  endereco VARCHAR(200)
);

-- -----------------------------------------------------
-- Pets: todo pet pertence obrigatoriamente a um tutor (NOT NULL + FK)
-- -----------------------------------------------------
CREATE TABLE pets (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  nome            VARCHAR(80) NOT NULL,
  especie         VARCHAR(40) NOT NULL,
  raca            VARCHAR(60),
  data_nascimento DATE,
  tutor_id        INTEGER NOT NULL,
  FOREIGN KEY (tutor_id) REFERENCES tutores(id)
);

-- -----------------------------------------------------
-- Agendamentos
-- -----------------------------------------------------
CREATE TABLE agendamentos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  pet_id     INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL,
  data_hora  DATETIME NOT NULL,
  motivo     VARCHAR(200) NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'Agendado'
             CHECK (status IN ('Agendado','Concluído','Cancelado')),
  FOREIGN KEY (pet_id)     REFERENCES pets(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =====================================================
-- DADOS INICIAIS (mínimo de 3 registros por tabela)
-- Logins de teste:
--   admin@clinica.com / admin123
--   vet@clinica.com   / vet12345
--   recep@clinica.com / recep123
-- =====================================================
INSERT INTO usuarios (nome, email, senha_hash) VALUES
('Administrador',     'admin@clinica.com', '$2a$10$lp.ItfKJ.Pp2Pf1VtigIHeWSuzEgTtwc1pjD0yDuAJ4itGurbun5m'),
('Dra. Marina Souza', 'vet@clinica.com',   '$2a$10$idP5YUDvAvbDSlnH0Hjn/ujR/kiW3/L6ZaeeVZ6Zp.qqGP3BnWLQC'),
('Carlos Recepção',   'recep@clinica.com', '$2a$10$t0nSG4fghY0p0dUJSeWjT./1GnVkWotPfsYVObGRACqfhgMWVnG2S');

-- Os CPFs abaixo estão criptografados (o sistema os descriptografa para exibir).
INSERT INTO tutores (nome, cpf, cpf_hash, telefone, email, endereco) VALUES
('Ana Paula Lima',
 '051a24fef5669483e1872b55:4168e5f0ec7ee228088670198c96cfe7:4458bddefc2e946c38dc5e',
 '8847d6adb27fbcef3fc60957f54f2a04cb35c44fd4e8f844c65a8a5672670c00',
 '(71) 99999-1111', 'ana@email.com', 'Rua das Flores, 10 - Salvador/BA'),
('Bruno Carvalho',
 '5d5acb6c982cc294840218c8:ca0c4235b5a708a61574dfe232bdc734:b96c29f940d4fe34e09627',
 '608bb86a2664db48cfc90cd922b46f0b1a66bfbc7112ecbdf9b3431c39faf61a',
 '(71) 98888-2222', 'bruno@email.com', 'Av. Central, 250 - Lauro de Freitas/BA'),
('Carla Mendes',
 'aebee5778a887455e60457d9:854e203742bdae907dd681cb38bfe6c4:f2f175adc0e6c002ff91ba',
 '2d3ec12a72a67799eb88ee2bddd294efc5fa1c570890c9d32df371a6e1ff2dca',
 '(71) 97777-3333', 'carla@email.com', 'Rua do Sol, 77 - Camaçari/BA');

INSERT INTO pets (nome, especie, raca, data_nascimento, tutor_id) VALUES
('Rex',  'Cachorro', 'Labrador', '2020-03-15', 1),
('Mia',  'Gato',     'Siamês',   '2021-07-02', 2),
('Thor', 'Cachorro', 'Bulldog',  '2019-11-20', 3),
('Luna', 'Gato',     'Persa',    '2022-01-10', 1);

INSERT INTO agendamentos (pet_id, usuario_id, data_hora, motivo, status) VALUES
(1, 1, '2026-11-25 09:00:00', 'Vacinação anual',         'Agendado'),
(2, 2, '2026-11-25 10:30:00', 'Consulta de rotina',      'Agendado'),
(3, 3, '2026-11-20 14:00:00', 'Avaliação dermatológica', 'Concluído');
