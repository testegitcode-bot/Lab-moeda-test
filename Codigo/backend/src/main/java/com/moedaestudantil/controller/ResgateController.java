package com.moedaestudantil.controller;

import com.moedaestudantil.dto.ResgateResponse;
import com.moedaestudantil.messaging.ResgateProducer;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.ResgateRepository;
import com.moedaestudantil.repository.VantagemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resgates")
public class ResgateController {

    private final ResgateProducer resgateProducer;
    private final ResgateRepository resgateRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;

    public ResgateController(ResgateProducer resgateProducer,
                              ResgateRepository resgateRepository,
                              AlunoRepository alunoRepository,
                              VantagemRepository vantagemRepository) {
        this.resgateProducer = resgateProducer;
        this.resgateRepository = resgateRepository;
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
    }

    // Enfileira pedido de resgate de forma assíncrona via RabbitMQ
    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitar(@RequestBody Map<String, Long> body) {
        Long alunoId = body.get("alunoId");
        Long vantagemId = body.get("vantagemId");

        if (alunoId == null || vantagemId == null) {
            return ResponseEntity.badRequest().body(Map.of("erro", "alunoId e vantagemId são obrigatórios."));
        }
        if (!alunoRepository.existsById(alunoId)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Aluno não encontrado."));
        }
        if (!vantagemRepository.existsById(vantagemId)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Vantagem não encontrada."));
        }

        resgateProducer.enviar(alunoId, vantagemId);
        return ResponseEntity.accepted().body(Map.of("mensagem", "Pedido de resgate enfileirado com sucesso."));
    }

    // Histórico de cupons do aluno
    @GetMapping("/aluno/{alunoId}")
    public List<ResgateResponse> listarPorAluno(@PathVariable Long alunoId) {
        return resgateRepository.findByAlunoIdOrderByDataResgateDesc(alunoId)
                .stream().map(ResgateResponse::from).toList();
    }
}
