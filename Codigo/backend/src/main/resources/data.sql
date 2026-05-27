-- Populate Instituicao
INSERT INTO instituicao (id, nome)
  VALUES (1, 'Universidade Federal de Minas Gerais (UFMG)')
  ON CONFLICT (id) DO NOTHING;

INSERT INTO instituicao (id, nome)
  VALUES (2, 'Pontifícia Universidade Católica de Minas Gerais (PUC-MG)')
  ON CONFLICT (id) DO NOTHING;

INSERT INTO instituicao (id, nome)
  VALUES (3, 'Centro Federal de Educação Tecnológica de Minas Gerais (CEFET-MG)')
  ON CONFLICT (id) DO NOTHING;

-- Populate Usuario for test Professor
INSERT INTO usuario (id, nome, email, senha, tipo)
  VALUES (1, 'Prof. Carlos Silva', 'professor@teste.com', '123456', 'PROFESSOR')
  ON CONFLICT (id) DO NOTHING;

-- Populate Professor linked to Usuario
INSERT INTO professor (id, departamento, saldo_moedas, instituicao_id)
  VALUES (1, 'Ciência da Computação', 1000, 1)
  ON CONFLICT (id) DO NOTHING;

-- Corrigir sequence após inserts manuais
SELECT setval(pg_get_serial_sequence('usuario', 'id'), (SELECT MAX(id) FROM usuario));