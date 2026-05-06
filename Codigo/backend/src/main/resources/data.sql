-- Populate Instituicao
INSERT INTO instituicao (id, nome) VALUES (1, 'Universidade Federal de Minas Gerais (UFMG)');
INSERT INTO instituicao (id, nome) VALUES (2, 'Pontifícia Universidade Católica de Minas Gerais (PUC-MG)');
INSERT INTO instituicao (id, nome) VALUES (3, 'Centro Federal de Educação Tecnológica de Minas Gerais (CEFET-MG)');

-- Populate Usuario for test Professor
INSERT INTO usuario (id, nome, email, senha, tipo) VALUES (1, 'Prof. Carlos Silva', 'professor@teste.com', '123456', 'PROFESSOR');

-- Populate Professor linked to Usuario
INSERT INTO professor (id, departamento, saldo_moedas, instituicao_id) VALUES (1, 'Ciência da Computação', 1000, 1);
