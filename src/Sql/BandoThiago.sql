CREATE TABLE IF NOT EXISTS alternatives (
    alternative_id INTEGER PRIMARY KEY AUTOINCREMENT,
    alternative_letter CHAR(1) NOT NULL,
    alternative_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL CHECK(is_correct IN (0,1)),
    question_id INTEGER NOT NULL,
    UNIQUE(question_id, alternative_letter),
    FOREIGN KEY(question_id) REFERENCES questions(q_id)
);
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS questions (
    q_id INTEGER PRIMARY KEY AUTOINCREMENT,
    q_title TEXT NOT NULL,
    q_text TEXT NOT NULL,
    q_year INTEGER CHECK(q_year BETWEEN 1900 AND 2100) NOT NULL,
    q_category_id INTEGER NOT NULL,
    q_subcategory_id INTEGER NOT NULL,
    FOREIGN KEY(q_category_id) REFERENCES categories(category_id),
    FOREIGN KEY(q_subcategory_id) REFERENCES subcategories(subcategory_id)
);
CREATE TABLE IF NOT EXISTS subcategories (
    subcategory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subcategory_name TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    FOREIGN KEY(category_id) REFERENCES categories(category_id)
);

INSERT INTO 'categories'(category_name) 
VALUES('Biologia'),
('História'),
('Matemática')

INSERT INTO "subcategories" (subcategory_name, category_id)
VALUES('Citologia', 1),
('Roma antiga', 2),
('Sistemas Lineares', 3);

INSERT INTO "questions" (q_title, q_text, q_year, q_category_id, q_subcategory_id) 
VALUES ('Enem 2022','Em um sistema hipotético mantido sob iluminação, estão presentes uma célula autotrófica e uma célula heterotrófica. A esse sistema são fornecidos água, glicose e gás oxigênio, sendo esse último na forma de ¹⁸O₂.
Ao final de um período de 24 horas, a análise dos compostos presentes nesse sistema permitirá a detecção do isótopo no(a)',2022, 1, 1);

INSERT INTO "alternatives" (alternative_letter, alternative_text, is_correct, question_id)
VALUES('E', 'texto alternativa', 0, 1);

INSERT INTO "questions" (q_title, q_text, q_year, q_category_id, q_subcategory_id)
VALUES('Enem 2024', 'Um pintor pretende fazer uma reprodução do quadro Guernica em uma tela de dimensões 20 cm por 30 cm. Essa obra, de autoria do espanhol Pablo Picasso, é uma pintura com 3,6 m de altura e 7,8 m de comprimento. A reprodução a ser feita deverá preencher a maior área possível da tela, mantendo a proporção entre as dimensões da obra original. A escala que deve ser empregada para essa reprodução é', 2024, 3, 4)

-- {
--   "question_id": 1,
--   "alternatives": [
--     {
--       "letter": "C",
--       "text": "etanol produzido na fermentação",
--       "is_correct": false
--     }
--     ]
-- }