CREATE DATABASE IF NOT EXISTS macawdemy;
USE macawdemy;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL UNIQUE, 
    senha VARCHAR(255) NOT NULL, 
    is_aluno TINYINT(1) NOT NULL DEFAULT 0, 
    is_professor TINYINT(1) NOT NULL DEFAULT 0, 
    is_admin TINYINT(1) NOT NULL DEFAULT 0, 
    foto LONGBLOB, 
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP  
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS professores(
    usuario_id INT PRIMARY KEY,
    materia VARCHAR(150),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admin(
    usuario_id INT PRIMARY KEY,
    usuario_email VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_email) REFERENCES usuarios(email) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alunos(
    usuario_id INT PRIMARY KEY,
    modoIntensivo TINYINT(1) NOT NULL DEFAULT 0,
    diagnostico TEXT,
    plano_estudo_id INT DEFAULT NULL,
    ranking INT DEFAULT 0, 
    xp BIGINT DEFAULT 0,
    progresso_percent TINYINT DEFAULT 0 CHECK (progresso_percent BETWEEN 0 AND 100),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (plano_estudo_id) REFERENCES plano_estudos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS material(
    id INT AUTO_INCREMENT PRIMARY KEY,
    tema VARCHAR(255),
    subtema VARCHAR(255),
    materia VARCHAR(255),
    titulo VARCHAR(255) NOT NULL,
    arquivo LONGBLOB NOT NULL,
    criado_por INT,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS progresso_atividades (
    usuario_id INT NOT NULL,
    atividade_id INT NOT NULL,
    concluida TINYINT(1) DEFAULT 0,
    concluida_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (atividade_id) REFERENCES material(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, atividade_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notificacoes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensagem TEXT NOT NULL,
    destinatario_id INT NOT NULL, 
    lida TINYINT DEFAULT 0,
    FOREIGN KEY (destinatario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS desafios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao VARCHAR(255),
    xp INT DEFAULT 0,
    img LONGBLOB
);

CREATE TABLE IF NOT EXISTS progresso_desafios (
    usuario_id INT NOT NULL,
    desafio_id INT NOT NULL,
    progresso INT DEFAULT 0,
    concluida TINYINT(1) DEFAULT 0,
    concluida_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, desafio_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (desafio_id) REFERENCES desafios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS flashcards(
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    pergunta TEXT NOT NULL,
    resposta TEXT NOT NULL,
    materia VARCHAR(100),
    ultima_revisao DATETIME,
    proxima_revisao DATETIME,
    repeticoes INT DEFAULT 0,
    dificuldade FLOAT DEFAULT 2.5, 
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS redacoes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    tema VARCHAR(255) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    texto LONGTEXT NOT NULL,
    tempo TIME, 
    comp1 INT,
    comp2 INT,
    comp3 INT,
    comp4 INT,
    comp5 INT,
    nota_ia INT, 
    nota_professor INT,
    corrigida_por_professor INT, 
    corrigida  TINYINT(1) DEFAULT 0 NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (corrigida_por_professor) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS plano_estudos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    dia DATE NOT NULL,
    materia TEXT,
    tema TEXT,
    inicio TIME,
    termino TIME,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS simulados(
    id INT AUTO_INCREMENT PRIMARY KEY,
    feito_por INT,
    data DATE,
    pontuacao INT,
    FOREIGN KEY (feito_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories(
    category_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    category_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS subcategories(
    subcategory_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    category_name TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE IF NOT EXISTS questions(
    q_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    q_title TEXT NOT NULL,
    q_text TEXT NOT NULL,
    q_year INTEGER NOT NULL,
    q_category_id INTEGER NOT NULL, 
    q_subcategory_id INTEGER NOT NULL,
    FOREIGN KEY (q_category_id) REFERENCES categories(category_id),
    FOREIGN KEY (q_subcategory_id) REFERENCES subcategories(subcategory_id)
);

CREATE TABLE IF NOT EXISTS alternatives(
    alternative_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    alternative_letter CHAR(1) NOT NULL,
    alternative_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    question_id INTEGER NOT NULL,
    UNIQUE(question_id),
    FOREIGN KEY (question_id) REFERENCES questions(q_id)
);
