package com.moedaestudantil.controller;

import com.moedaestudantil.dto.EnviarMoedasRequest;
import com.moedaestudantil.dto.TransacaoResponse;
import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.model.Transacao;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import com.moedaestudantil.repository.TransacaoRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transacoes")
public class TransacaoController {

    private final TransacaoRepository transacaoRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;

    public TransacaoController(TransacaoRepository transacaoRepository,
                               ProfessorRepository professorRepository,
                               AlunoRepository alunoRepository) {
        this.transacaoRepository = transacaoRepository;
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
    }

    /**
     * POST /api/transacoes/enviar
     * Professor envia moedas para um aluno.
     */
    @PostMapping("/enviar")
    public ResponseEntity<?> enviarMoedas(@Valid @RequestBody EnviarMoedasRequest request) {
        Professor professor = professorRepository.findById(request.getProfessorId())
                .orElse(null);
        if (professor == null) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Professor não encontrado."));
        }

        Aluno aluno = alunoRepository.findById(request.getAlunoId())
                .orElse(null);
        if (aluno == null) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Aluno não encontrado."));
        }

        if (professor.getSaldoMoedas() < request.getQuantidade()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Saldo insuficiente. Você tem " + professor.getSaldoMoedas() + " moedas."));
        }

        // Debita do professor
        professor.setSaldoMoedas(professor.getSaldoMoedas() - request.getQuantidade());
        professorRepository.save(professor);

        // Credita no aluno
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + request.getQuantidade());
        alunoRepository.save(aluno);

        // Registra transação
        Transacao transacao = new Transacao();
        transacao.setRemetente(professor);
        transacao.setDestinatario(aluno);
        transacao.setQuantidade(request.getQuantidade());
        transacao.setMensagem(request.getMensagem());
        Transacao saved = transacaoRepository.save(transacao);

        return ResponseEntity.ok(TransacaoResponse.from(saved));
    }

    /**
     * GET /api/transacoes/professor/{id}
     * Extrato de moedas enviadas pelo professor.
     */
    @GetMapping("/professor/{id}")
    public ResponseEntity<?> extratoDosProfessor(@PathVariable Long id) {
        List<TransacaoResponse> lista = transacaoRepository
                .findByRemetenteIdOrderByCriadoEmDesc(id)
                .stream()
                .map(TransacaoResponse::from)
                .toList();
        return ResponseEntity.ok(lista);
    }

    /**
     * GET /api/transacoes/aluno/{id}
     * Extrato de moedas recebidas pelo aluno.
     */
    @GetMapping("/aluno/{id}")
    public ResponseEntity<?> extratoDoAluno(@PathVariable Long id) {
        List<TransacaoResponse> lista = transacaoRepository
                .findByDestinatarioIdOrderByCriadoEmDesc(id)
                .stream()
                .map(TransacaoResponse::from)
                .toList();
        return ResponseEntity.ok(lista);
    }

    /**
     * GET /api/transacoes/alunos/instituicao/{id}
     * Lista alunos da mesma instituição do professor (para o select de envio).
     */
    @GetMapping("/alunos/instituicao/{instituicaoId}")
    public ResponseEntity<?> alunosPorInstituicao(@PathVariable Long instituicaoId) {
        List<Map<String, Object>> alunos = alunoRepository.findAll()
                .stream()
                .filter(a -> a.getInstituicao() != null
                        && a.getInstituicao().getId().equals(instituicaoId))
                .map(a -> Map.<String, Object>of(
                        "id", a.getId(),
                        "nome", a.getNome(),
                        "email", a.getEmail(),
                        "curso", a.getCurso() != null ? a.getCurso() : "",
                        "saldoMoedas", a.getSaldoMoedas()
                ))
                .toList();
        return ResponseEntity.ok(alunos);
    }
}