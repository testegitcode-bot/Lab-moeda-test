package com.moedaestudantil.controller;

import com.moedaestudantil.dto.CadastroProfessorRequest;
import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.model.Usuario;
import com.moedaestudantil.repository.InstituicaoRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import com.moedaestudantil.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ProfessorRepository professorRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final UsuarioRepository usuarioRepository;

    public ProfessorController(ProfessorRepository professorRepository,
                               InstituicaoRepository instituicaoRepository,
                               UsuarioRepository usuarioRepository) {
        this.professorRepository = professorRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<Professor> listar() {
        return professorRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody CadastroProfessorRequest request) {
        if (usuarioRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Email já cadastrado.");
        }

        Instituicao instituicao = instituicaoRepository.findById(request.instituicaoId())
                .orElseThrow(() -> new IllegalArgumentException("Instituição não encontrada: " + request.instituicaoId()));

        Professor professor = new Professor();
        professor.setNome(request.nome());
        professor.setEmail(request.email());
        professor.setSenha(request.senha());
        professor.setTipo(Usuario.TipoUsuario.PROFESSOR);
        professor.setCpf(request.cpf());
        professor.setDepartamento(request.departamento());
        professor.setInstituicao(instituicao);
        professor.setSaldoMoedas(1000);

        return ResponseEntity.ok(professorRepository.save(professor));
    }
}
