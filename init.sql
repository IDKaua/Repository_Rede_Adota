-- 1. Tabela Endereço (Independente)
CREATE TABLE endereco (
    id SERIAL PRIMARY KEY,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(50),
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL
);

-- 2. Tabela ONG (Depende de Endereço)
CREATE TABLE ong (
    id SERIAL PRIMARY KEY,
    id_endereco INT REFERENCES endereco(id) ON DELETE SET NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    descricao TEXT,
    telefone VARCHAR(20),
    capacidade_atual INT,
    chave_pix VARCHAR(255)
);

-- 3. Tabela Pet (Depende de ONG)
CREATE TABLE pet (
    id SERIAL PRIMARY KEY,
    id_ong INT REFERENCES ong(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL, -- Ex: 'Cachorro', 'Gato'
    raca VARCHAR(100),
    sexo VARCHAR(20),
    idade_meses INT,
    porte VARCHAR(50),
    condicao_saude VARCHAR(255),
    descricao TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela Foto Pet (Depende de Pet - Relação 1:N que identificámos)
CREATE TABLE foto_pet (
    id SERIAL PRIMARY KEY,
    id_pet INT REFERENCES pet(id) ON DELETE CASCADE,
    url_foto TEXT NOT NULL,
    foto_capa BOOLEAN DEFAULT FALSE
);

-- 5. Tabela Evento (Depende de Endereço e ONG)
CREATE TABLE evento (
    id SERIAL PRIMARY KEY,
    id_endereco INT REFERENCES endereco(id) ON DELETE SET NULL,
    id_ong INT REFERENCES ong(id) ON DELETE CASCADE,
    titulo_evento VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    hora_evento TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Ativo'
);

ALTER TABLE ong ADD COLUMN cnpj VARCHAR(20) UNIQUE;

-- 1. Tabela Base de Solicitações
CREATE TABLE solicitacao (
    id SERIAL PRIMARY KEY,
    id_ong INT REFERENCES ong(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'Adoção' ou 'Doação'
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'Solicitado',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela Formulario_Adoção (Detalhes específicos de adoção)
CREATE TABLE formulario_adocao (
    id SERIAL PRIMARY KEY,
    id_solicitacao INT REFERENCES solicitacao(id) ON DELETE CASCADE,
    id_pet INT REFERENCES pet(id) ON DELETE SET NULL,
    tipo_moradia VARCHAR(100) NOT NULL,
    possui_quintal VARCHAR(50) NOT NULL,
    possui_outros_animais VARCHAR(50) NOT NULL,
    motivo_adocao TEXT NOT NULL,
    tempo_disponivel VARCHAR(100) NOT NULL,
    aceita_acompanhamento VARCHAR(20) NOT NULL,
    observacoes TEXT
);

-- 3. Tabela Formulario_Doação (Detalhes específicos de doação/entrega)
CREATE TABLE formulario_doacao (
    id SERIAL PRIMARY KEY,
    id_solicitacao INT REFERENCES solicitacao(id) ON DELETE CASCADE,
    endereco_completo TEXT NOT NULL,
    nome_animal VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(100) NOT NULL,
    sexo VARCHAR(20) NOT NULL,
    idade VARCHAR(50) NOT NULL,
    vacinas_tomadas VARCHAR(255),
    descricao_adicional TEXT
);