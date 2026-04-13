CREATE DATABASE IF NOT EXISTS abrigo_vacinas;
USE abrigo_vacinas;

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel_acesso VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabela de Adotantes
CREATE TABLE IF NOT EXISTS adotantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    NomeCompleto VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) NOT NULL UNIQUE,
    RG VARCHAR(20),
    Telefone VARCHAR(20),
    RuaNumero VARCHAR(255),
    Bairro VARCHAR(100),
    CEP VARCHAR(10)
) ENGINE=InnoDB;

-- 3. Tabela de Animais
CREATE TABLE IF NOT EXISTS animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_animal VARCHAR(100) NOT NULL,
    data_cadastro DATE NOT NULL,
    sexo ENUM('Macho', 'Fêmea') NOT NULL,
    raca VARCHAR(100),
    porte ENUM('Pequeno', 'Médio', 'Grande') NOT NULL,
    idade INT NOT NULL
) ENGINE=InnoDB;

-- 4. Tabela de Vacinas
CREATE TABLE IF NOT EXISTS vacinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    cadastrado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Relacionamento Animal x Vacina
CREATE TABLE IF NOT EXISTS animal_vacina (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    vacina_id INT NOT NULL,
    data_aplicacao DATE NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (animal_id) REFERENCES animais(id),
    FOREIGN KEY (vacina_id) REFERENCES vacinas(id)
) ENGINE=InnoDB;

-- 6. Tabela de Estoque
CREATE TABLE IF NOT EXISTS estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_item VARCHAR(100) NOT NULL,
    categoria ENUM('Alimentação', 'Medicamento', 'Higiene', 'Outros') NOT NULL,
    quantidade_atual DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    unidade_medida VARCHAR(20) NOT NULL,
    quantidade_minima DECIMAL(10, 2) DEFAULT 0.00,
    data_validade DATE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. Tabela de Histórico
CREATE TABLE IF NOT EXISTS historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    descricao TEXT,
    data_evento DATE,
    responsavel VARCHAR(100),
    FOREIGN KEY (animal_id) REFERENCES animais(id)
) ENGINE=InnoDB;

-- 8. Tabela de Procedimentos Veterinários 
CREATE TABLE IF NOT EXISTS procedimentos_veterinarios (
    ProcedimentoID INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    data_procedimento DATE NOT NULL,
    descricao TEXT NOT NULL,
    veterinario VARCHAR(150) NOT NULL,
    situacao VARCHAR(50) NOT NULL DEFAULT 'Realizado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animais(id)
) ENGINE=InnoDB;
-- RF-F3 - Validação de Aptidão para Adoção

ALTER TABLE animais 
ADD COLUMN status_adocao VARCHAR(20) DEFAULT 'Em análise',
ADD COLUMN justificativa TEXT,
ADD COLUMN data_validacao DATETIME;