package com.moedaestudantil.controller;

import com.moedaestudantil.dto.CadastroProfessorRequest;
import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.model.Usuario;
import com.moedaestudantil.repository.InstituicaoRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import com.moedaestudantil.repository.TransacaoRepository;
import com.moedaestudantil.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ProfessorRepository professorRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final TransacaoRepository transacaoRepository;

    public ProfessorController(ProfessorRepository professorRepository,
                               InstituicaoRepository instituicaoRepository,
                               UsuarioRepository usuarioRepository,
                               TransacaoRepository transacaoRepository) {
        this.professorRepository = professorRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.transacaoRepository = transacaoRepository;
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

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<Professor> opt = professorRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Professor professor = opt.get();
        if (body.containsKey("nome")) professor.setNome((String) body.get("nome"));
        if (body.containsKey("departamento")) professor.setDepartamento((String) body.get("departamento"));
        if (body.containsKey("saldoMoedas")) {
            professor.setSaldoMoedas(((Number) body.get("saldoMoedas")).intValue());
        }
        return ResponseEntity.ok(professorRepository.save(professor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        if (!professorRepository.existsById(id)) return ResponseEntity.notFound().build();
        transacaoRepository.deleteByRemetenteId(id);
        professorRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensagem", "Professor removido com sucesso."));
    }
}
