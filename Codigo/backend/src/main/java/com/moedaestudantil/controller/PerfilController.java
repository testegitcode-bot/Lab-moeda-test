package com.moedaestudantil.controller;

import com.moedaestudantil.dto.UsuarioResponse;
import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import com.moedaestudantil.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    private final AlunoRepository alunoRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;

    public PerfilController(AlunoRepository alunoRepository,
                            EmpresaParceiraRepository empresaRepository,
                            UsuarioRepository usuarioRepository) {
        this.alunoRepository = alunoRepository;
        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Atualiza dados do perfil do aluno.
     * Body: { nome, email, curso, endereco, rg, senhaAtual?, novaSenha? }
     */
    @PutMapping("/aluno/{id}")
    public ResponseEntity<?> atualizarAluno(@PathVariable Long id,
                                             @RequestBody Map<String, String> body) {
        Optional<Aluno> opt = alunoRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Aluno aluno = opt.get();

        // Atualizar e-mail: verificar duplicata
        String novoEmail = body.get("email");
        if (novoEmail != null && !novoEmail.equals(aluno.getEmail())) {
            if (usuarioRepository.existsByEmail(novoEmail)) {
                return ResponseEntity.badRequest().body(Map.of("erro", "E-mail já está em uso."));
            }
            aluno.setEmail(novoEmail);
        }

        if (body.containsKey("nome"))     aluno.setNome(body.get("nome"));
        if (body.containsKey("curso"))    aluno.setCurso(body.get("curso"));
        if (body.containsKey("endereco")) aluno.setEndereco(body.get("endereco"));
        if (body.containsKey("rg"))       aluno.setRg(body.get("rg"));

        // Alterar senha (opcional)
        String senhaAtual = body.get("senhaAtual");
        String novaSenha  = body.get("novaSenha");
        if (novaSenha != null && !novaSenha.isBlank()) {
            if (senhaAtual == null || !senhaAtual.equals(aluno.getSenha())) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Senha atual incorreta."));
            }
            aluno.setSenha(novaSenha);
        }

        Aluno saved = alunoRepository.save(aluno);
        return ResponseEntity.ok(UsuarioResponse.from(saved));
    }

    /**
     * Atualiza dados do perfil da empresa.
     * Body: { nome, email, descricao, senhaAtual?, novaSenha? }
     */
    @PutMapping("/empresa/{id}")
    public ResponseEntity<?> atualizarEmpresa(@PathVariable Long id,
                                               @RequestBody Map<String, String> body) {
        Optional<EmpresaParceira> opt = empresaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        EmpresaParceira empresa = opt.get();

        // Atualizar e-mail: verificar duplicata
        String novoEmail = body.get("email");
        if (novoEmail != null && !novoEmail.equals(empresa.getEmail())) {
            if (usuarioRepository.existsByEmail(novoEmail)) {
                return ResponseEntity.badRequest().body(Map.of("erro", "E-mail já está em uso."));
            }
            empresa.setEmail(novoEmail);
        }

        if (body.containsKey("nome"))      empresa.setNome(body.get("nome"));
        if (body.containsKey("descricao")) empresa.setDescricao(body.get("descricao"));

        // Alterar senha (opcional)
        String senhaAtual = body.get("senhaAtual");
        String novaSenha  = body.get("novaSenha");
        if (novaSenha != null && !novaSenha.isBlank()) {
            if (senhaAtual == null || !senhaAtual.equals(empresa.getSenha())) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Senha atual incorreta."));
            }
            empresa.setSenha(novaSenha);
        }

        EmpresaParceira saved = empresaRepository.save(empresa);
        return ResponseEntity.ok(UsuarioResponse.from(saved));
    }
}