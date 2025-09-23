CREATE DATABASE testesmacawdemy;
USE testesmacawdemy;

// Tabela Usuarios

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    isAluno TINYINT(1) DEFAULT 0,
    isProfessor TINYINT(1) DEFAULT 0,
    isAdmin TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tema VARCHAR(255) NOT NULL,
    materia VARCHAR(50) NOT NULL,
    arquivo VARCHAR(255) NOT NULL, -- nome do arquivo PDF
    criado_por INT NOT NULL, -- id do professor
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS progresso_atividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    tema VARCHAR(255) NOT NULL,
    atividade_id INT NOT NULL,
    progresso INT DEFAULT 0, -- 0 a 100
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (atividade_id) REFERENCES materias(id)
);

// Teste tabela materias
-- Inserindo exemplos de matérias
INSERT INTO material (titulo, tema, materia, arquivo, criado_por)
VALUES
('Gramática Básica', 'Substantivos e Adjetivos', 'Linguagens', 'LOAD_FILE('C:/Users/marce/Desktop/TCC/teste.pdf')', 1),
('Interpretação de Texto', 'Leitura e Compreensão', 'Linguagens', 'interpretacao_texto.pdf', 1),
('Funções e Equações', 'Funções Lineares', 'Matemática', 'funcoes_equacoes.pdf', 2),
('Cálculo de Áreas', 'Geometria', 'Matemática', 'calculo_areas.pdf', 2),
('Sistema Solar', 'Planetas e Satélites', 'Ciências da Natureza', 'sistema_solar.pdf', 3),
('Fotossíntese', 'Processo Biológico', 'Ciências da Natureza', 'fotossintese.pdf', 3),
('Revolução Francesa', 'História Moderna', 'Ciências Humanas', 'revolucao_francesa.pdf', 4),
('Direitos Humanos', 'Declaração Universal', 'Ciências Humanas', 'direitos_humanos.pdf', 4),
('Como escrever uma redação', 'Estrutura e Argumentação', 'Redação', 'redacao_estruturada.pdf', 1);

C:/Users/marce/Downloads/Equipe_07-QTS_14-08-25.pdf

INSERT INTO material (titulo, tema, materia, arquivo, criado_por)
VALUES (
    'Teste PDF',
    'Tema Exemplo',
    'Linguagens',
    LOAD_FILE('C:/Users/marce/Desktop/TCC/teste.pdf'),
    1
);

