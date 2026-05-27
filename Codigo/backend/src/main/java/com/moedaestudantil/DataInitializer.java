package com.moedaestudantil;

import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.model.Usuario;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.InstituicaoRepository;
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

    public DataInitializer(AlunoRepository alunoRepository,
                           UsuarioRepository usuarioRepository,
                           InstituicaoRepository instituicaoRepository) {
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
        this.instituicaoRepository = instituicaoRepository;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByEmail(TEST_ALUNO_EMAIL).isPresent()) {
            log.info("Usuário de testes já existe, ignorando seed.");
            return;
        }

        Instituicao inst = instituicaoRepository.findById(1L).orElse(null);

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
    }
}
