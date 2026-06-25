-- =============================================================
--  SEED — Dados de teste para Moeda Estudantil
--  Ordem: instituicao → usuario (base) → subtabelas (aluno /
--         professor / empresa_parceira) → vantagem → transacao
--         → resgate
--  Senha de todos os usuários: 123456
-- =============================================================

-- ─────────────────────────────────────────────
--  1. INSTITUIÇÕES
-- ─────────────────────────────────────────────
INSERT INTO instituicao (id, nome) VALUES
  (1, 'Universidade Federal de Minas Gerais (UFMG)'),
  (2, 'Pontifícia Universidade Católica de Minas Gerais (PUC-MG)'),
  (3, 'Centro Federal de Educação Tecnológica de Minas Gerais (CEFET-MG)')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
--  2. USUÁRIOS — tabela base (herança JOINED)
-- ─────────────────────────────────────────────

-- Admin (tipo especial — sem subtabela própria)
INSERT INTO usuario (id, nome, email, senha, tipo) VALUES
  (10, 'Administrador do Sistema', 'admin@sistema.local', '123456', 'ADMIN')
ON CONFLICT (id) DO NOTHING;

-- Professores
INSERT INTO usuario (id, nome, email, senha, tipo) VALUES
  (20, 'Prof. Carlos Silva',   'carlos.silva@ufmg.br',     '123456', 'PROFESSOR'),
  (21, 'Profa. Ana Oliveira',  'ana.oliveira@pucmg.br',    '123456', 'PROFESSOR'),
  (22, 'Prof. Marcos Rocha',   'marcos.rocha@cefetmg.br',  '123456', 'PROFESSOR')
ON CONFLICT (id) DO NOTHING;

-- Alunos
INSERT INTO usuario (id, nome, email, senha, tipo) VALUES
  (30, 'Lucas Ferreira',   'lucas.ferreira@aluno.ufmg.br',    '123456', 'ALUNO'),
  (31, 'Mariana Costa',    'mariana.costa@aluno.ufmg.br',     '123456', 'ALUNO'),
  (32, 'Pedro Henrique',   'pedro.henrique@aluno.pucmg.br',   '123456', 'ALUNO'),
  (33, 'Julia Mendes',     'julia.mendes@aluno.pucmg.br',     '123456', 'ALUNO'),
  (34, 'Rafael Souza',     'rafael.souza@aluno.cefetmg.br',   '123456', 'ALUNO')
ON CONFLICT (id) DO NOTHING;

-- Empresas parceiras
INSERT INTO usuario (id, nome, email, senha, tipo) VALUES
  (40, 'Livraria Cultura',    'contato@livraricultura.com',  '123456', 'EMPRESA'),
  (41, 'TechCafé',            'contato@techcafe.com.br',     '123456', 'EMPRESA'),
  (42, 'Academia FitStudent', 'contato@fitstudent.com.br',   '123456', 'EMPRESA')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
--  3. PROFESSORES (subtabela)
-- ─────────────────────────────────────────────
INSERT INTO professor (id, departamento, cpf, saldo_moedas, instituicao_id) VALUES
  (20, 'Ciência da Computação',         '11122233344', 1000, 1),
  (21, 'Sistemas de Informação',        '22233344455', 1000, 2),
  (22, 'Engenharia Elétrica',           '33344455566',  800, 3)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
--  4. ALUNOS (subtabela)
-- ─────────────────────────────────────────────
INSERT INTO aluno (id, cpf, rg, endereco, curso, saldo_moedas, is_test_user, instituicao_id) VALUES
  (30, '44455566677', '1234567',  'Rua das Flores, 10 - BH',     'Ciência da Computação',  450, false, 1),
  (31, '55566677788', '2345678',  'Av. Presidente, 200 - BH',    'Engenharia de Software',  300, false, 1),
  (32, '66677788899', '3456789',  'Rua Goitacases, 50 - BH',     'Administração',           200, false, 2),
  (33, '77788899900', '4567890',  'Rua da Bahia, 100 - BH',      'Design Gráfico',          150, false, 2),
  (34, '88899900011', '5678901',  'Av. Amazonas, 750 - BH',      'Mecatrônica',             500, false, 3)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
--  5. EMPRESAS PARCEIRAS (subtabela)
-- ─────────────────────────────────────────────
INSERT INTO empresa_parceira (id, cnpj, descricao, ativo) VALUES
  (40, '11222333000181', 'Maior rede de livrarias do Brasil. Descontos exclusivos em livros técnicos e universitários.', true),
  (41, '22333444000192', 'Café e coworking tech no coração de BH. Bebidas e lanches com desconto para estudantes.', true),
  (42, '33444555000103', 'Academia focada em estudantes. Mensalidade especial e planos flexíveis.', true)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
--  6. VANTAGENS (ofertas das empresas)
-- ─────────────────────────────────────────────
INSERT INTO vantagem (id, nome, descricao, custo, quantidade_cupons, cupons_resgatados, data_validade, is_resgate_unico, empresa_id) VALUES
  (1, '20% de desconto em livros técnicos',
      'Apresente o cupom e ganhe 20% de desconto em qualquer livro da área de exatas ou tecnologia.',
      100, 50, 0, '2025-12-31', false, 40),
  (2, 'Frete grátis em compras acima de R$50',
      'Retire seu cupom e use na loja online. Válido para todo o Brasil.',
      50, NULL, 0, NULL, false, 40),
  (3, 'Combo Café + Salgado por R$10',
      'Troque seu cupom por um café especial e um salgado à escolha.',
      80, 100, 0, '2025-09-30', false, 41),
  (4, 'Dia de coworking gratuito',
      'Reserve uma mesa no TechCafé por um dia inteiro sem custo.',
      150, 20, 0, NULL, true, 41),
  (5, '1 mês de academia grátis',
      'Matrícula isenta no primeiro mês. Válido para novos alunos.',
      300, 30, 0, '2025-11-30', true, 42),
  (6, 'Avaliação física gratuita',
      'Consulta de bioimpedância e avaliação postural sem custo.',
      50, NULL, 0, NULL, true, 42)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
--  7. TRANSAÇÕES (professor → aluno)
-- ─────────────────────────────────────────────
INSERT INTO transacao (id, remetente_id, destinatario_id, quantidade, mensagem, criado_em) VALUES
  (1, 20, 30, 200, 'Excelente desempenho na prova de Algoritmos!',             NOW() - INTERVAL '10 days'),
  (2, 20, 31, 150, 'Ótimo trabalho no projeto de Banco de Dados.',              NOW() - INTERVAL '8 days'),
  (3, 21, 32, 100, 'Participação ativa nas aulas de Gestão.',                   NOW() - INTERVAL '6 days'),
  (4, 21, 33, 100, 'Trabalho criativo e bem apresentado.',                      NOW() - INTERVAL '5 days'),
  (5, 22, 34, 200, 'Melhor relatório da turma em Sistemas Embarcados.',         NOW() - INTERVAL '3 days'),
  (6, 20, 30, 100, 'Participação no grupo de estudos.',                         NOW() - INTERVAL '2 days'),
  (7, 20, 31, 50,  'Pontualidade nas entregas.',                                NOW() - INTERVAL '1 day'),
  (8, 22, 34, 150, 'Excelente apresentação do projeto final.',                  NOW() - INTERVAL '12 hours')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
--  8. RESGATES (cupons gerados pelos alunos)
-- ─────────────────────────────────────────────
INSERT INTO resgate (id, aluno_id, vantagem_id, data_resgate, codigo_cupom, status) VALUES
  (1, 30, 1, NOW() - INTERVAL '7 days',  'CUP-2025-001-ABCD', 'ATIVO'),
  (2, 30, 3, NOW() - INTERVAL '5 days',  'CUP-2025-002-EFGH', 'USADO'),
  (3, 31, 2, NOW() - INTERVAL '4 days',  'CUP-2025-003-IJKL', 'ATIVO'),
  (4, 32, 5, NOW() - INTERVAL '3 days',  'CUP-2025-004-MNOP', 'ATIVO'),
  (5, 34, 6, NOW() - INTERVAL '2 days',  'CUP-2025-005-QRST', 'ATIVO'),
  (6, 30, 4, NOW() - INTERVAL '1 day',   'CUP-2025-006-UVWX', 'ATIVO'),
  (7, 33, 6, NOW() - INTERVAL '6 hours', 'CUP-2025-007-YZZZ', 'USADO')
ON CONFLICT (id) DO NOTHING;

-- Atualiza contadores de cupons resgatados nas vantagens
UPDATE vantagem SET cupons_resgatados = 2 WHERE id = 1; -- vantagem 1 resgatada por 2 alunos
UPDATE vantagem SET cupons_resgatados = 1 WHERE id = 2;
UPDATE vantagem SET cupons_resgatados = 1 WHERE id = 3;
UPDATE vantagem SET cupons_resgatados = 1 WHERE id = 4;
UPDATE vantagem SET cupons_resgatados = 1 WHERE id = 5;
UPDATE vantagem SET cupons_resgatados = 2 WHERE id = 6;

-- ─────────────────────────────────────────────
--  9. CORRIGIR SEQUENCES (evita conflito de ID
--     em inserts futuros pelo Hibernate)
-- ─────────────────────────────────────────────
SELECT setval(pg_get_serial_sequence('instituicao',    'id'), GREATEST((SELECT MAX(id) FROM instituicao),    1));
SELECT setval(pg_get_serial_sequence('usuario',        'id'), GREATEST((SELECT MAX(id) FROM usuario),        1));
SELECT setval(pg_get_serial_sequence('vantagem',       'id'), GREATEST((SELECT MAX(id) FROM vantagem),       1));
SELECT setval(pg_get_serial_sequence('transacao',      'id'), GREATEST((SELECT MAX(id) FROM transacao),      1));
SELECT setval(pg_get_serial_sequence('resgate',        'id'), GREATEST((SELECT MAX(id) FROM resgate),        1));
