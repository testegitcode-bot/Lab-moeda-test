-- Populate Instituicao
MERGE INTO instituicao (id, nome) KEY(id)
  VALUES (1, 'Universidade Federal de Minas Gerais (UFMG)');
MERGE INTO instituicao (id, nome) KEY(id)
  VALUES (2, 'Pontifícia Universidade Católica de Minas Gerais (PUC-MG)');
MERGE INTO instituicao (id, nome) KEY(id)
  VALUES (3, 'Centro Federal de Educação Tecnológica de Minas Gerais (CEFET-MG)');

-- Populate Usuario for test Professor
MERGE INTO usuario (id, nome, email, senha, tipo) KEY(id)
  VALUES (1, 'Prof. Carlos Silva', 'professor@teste.com', '123456', 'PROFESSOR');

-- Populate Professor linked to Usuario
MERGE INTO professor (id, departamento, saldo_moedas, instituicao_id) KEY(id)
  VALUES (1, 'Ciência da Computação', 1000, 1);
