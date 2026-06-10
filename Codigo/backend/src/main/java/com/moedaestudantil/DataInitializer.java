package com.moedaestudantil;

import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.model.Usuario;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.InstituicaoRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import com.moedaestudantil.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private static final String TEST_ALUNO_EMAIL = "aluno.teste@sistema.local";

    private final AlunoRepository alunoRepository;
    private final UsuarioRepository usuarioRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final ProfessorRepository professorRepository;

    public DataInitializer(AlunoRepository alunoRepository,
            UsuarioRepository usuarioRepository,
            InstituicaoRepository instituicaoRepository, ProfessorRepository professorRepository) {
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.professorRepository = professorRepository;
    }

    @Override
    public void run(String... args) {
        Instituicao inst = instituicaoRepository.findById(1L).orElse(null);

        // 1. Criação do Primeiro Aluno de Teste (se não existir)
        if (!usuarioRepository.findByEmail(TEST_ALUNO_EMAIL).isPresent()) {
            Aluno testAluno = new Aluno();
            testAluno.setNome("Aluno de Testes");
            testAluno.setEmail(TEST_ALUNO_EMAIL);
            testAluno.setSenha("123456");
            testAluno.setTipo(Usuario.TipoUsuario.ALUNO);
            testAluno.setCpf("00000000000");
            testAluno.setCurso("Engenharia de Software");
            testAluno.setSaldoMoedas(9999);
            testAluno.setInstituicao(inst);
            testAluno.setIsTestUser(true);

            alunoRepository.save(testAluno);
            log.info("Aluno de testes criado: {} | saldo: 9999 moedas", TEST_ALUNO_EMAIL);
        } else {
            log.info("Usuário de testes 1 já existe, ignorando seed.");
        }

        // 2. Criação do SEGUNDO Aluno de Teste (se não existir)
        String segundoEmail = "aluno.teste2@sistema.local";
        if (!usuarioRepository.findByEmail(segundoEmail).isPresent()) {
            Aluno testAluno2 = new Aluno();
            testAluno2.setNome("Segundo Aluno de Testes");
            testAluno2.setEmail(segundoEmail);
            testAluno2.setSenha("123456"); // Mesma senha para facilitar
            testAluno2.setTipo(Usuario.TipoUsuario.ALUNO);
            testAluno2.setCpf("11111111111"); // CPF diferente para evitar problemas de constraint unique
            testAluno2.setCurso("Engenharia de Software");
            testAluno2.setSaldoMoedas(9999); // Super saldo também!
            testAluno2.setInstituicao(inst);
            testAluno2.setIsTestUser(true); // Mantém oculto igual ao primeiro

            alunoRepository.save(testAluno2);
            log.info("Segundo aluno de testes criado: {} | saldo: 9999 moedas", segundoEmail);
        } else {
            log.info("Usuário de testes 2 já existe, ignorando seed.");
        }

        String professorEmail = "professor.teste@sistema.local";
        if (!usuarioRepository.findByEmail(professorEmail).isPresent()) {
            Professor professor = new Professor();
            professor.setNome("Professor de Testes");
            professor.setEmail(professorEmail);
            professor.setSenha("123456");
            professor.setTipo(Usuario.TipoUsuario.PROFESSOR);
            professor.setCpf("22222222222");
            professor.setDepartamento("Computação");
            professor.setSaldoMoedas(1000);
            professor.setInstituicao(inst);

            professorRepository.save(professor);
            log.info("Professor de testes criado: {}", professorEmail);
        } else {
            log.info("Professor de testes já existe, ignorando seed.");
        }
    }
}
