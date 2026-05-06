package com.moedaestudantil.controller;

import com.moedaestudantil.dto.CadastroAlunoRequest;
import com.moedaestudantil.dto.CadastroEmpresaRequest;
import com.moedaestudantil.dto.UsuarioResponse;
import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.model.Usuario;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import com.moedaestudantil.repository.InstituicaoRepository;
import com.moedaestudantil.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cadastro")
public class CadastroController {

    private final UsuarioRepository usuarioRepository;
    private final AlunoRepository alunoRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final InstituicaoRepository instituicaoRepository;

    public CadastroController(UsuarioRepository usuarioRepository,
                               AlunoRepository alunoRepository,
                               EmpresaParceiraRepository empresaRepository,
                               InstituicaoRepository instituicaoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.alunoRepository = alunoRepository;
        this.empresaRepository = empresaRepository;
        this.instituicaoRepository = instituicaoRepository;
    }

    @PostMapping("/aluno")
    public ResponseEntity<?> cadastrarAluno(@RequestBody CadastroAlunoRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "E-mail já cadastrado."));
        }

        Optional<Instituicao> instituicaoOpt = instituicaoRepository.findById(request.getInstituicaoId());
        if (instituicaoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Instituição não encontrada."));
        }

        Aluno aluno = new Aluno();
        aluno.setNome(request.getNome());
        aluno.setEmail(request.getEmail());
        aluno.setSenha(request.getSenha());
        aluno.setTipo(Usuario.TipoUsuario.ALUNO);
        aluno.setCpf(request.getCpf());
        aluno.setRg(request.getRg());
        aluno.setEndereco(request.getEndereco());
        aluno.setCurso(request.getCurso());
        aluno.setSaldoMoedas(0);
        aluno.setInstituicao(instituicaoOpt.get());

        Aluno saved = alunoRepository.save(aluno);
        return ResponseEntity.ok(UsuarioResponse.from(saved));
    }

    @PostMapping("/empresa")
    public ResponseEntity<?> cadastrarEmpresa(@RequestBody CadastroEmpresaRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "E-mail já cadastrado."));
        }
        if (empresaRepository.existsByCnpj(request.getCnpj())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "CNPJ já cadastrado."));
        }

        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setNome(request.getNome());
        empresa.setEmail(request.getEmail());
        empresa.setSenha(request.getSenha());
        empresa.setTipo(Usuario.TipoUsuario.EMPRESA);
        empresa.setCnpj(request.getCnpj());
        empresa.setDescricao(request.getDescricao());

        EmpresaParceira saved = empresaRepository.save(empresa);
        return ResponseEntity.ok(UsuarioResponse.from(saved));
    }
}
