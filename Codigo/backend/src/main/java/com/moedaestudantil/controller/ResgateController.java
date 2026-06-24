package com.moedaestudantil.controller;

import com.moedaestudantil.dto.ResgateRequest;
import com.moedaestudantil.dto.ResgateResponse;
import com.moedaestudantil.messaging.ResgateProducer;
import com.moedaestudantil.model.Resgate;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.ResgateRepository;
import com.moedaestudantil.repository.VantagemRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    /**
     * POST /api/resgates
     * Publica o pedido de resgate na fila RabbitMQ e retorna HTTP 202 imediatamente.
     */
    @PostMapping
    public ResponseEntity<?> resgatar(@Valid @RequestBody ResgateRequest request) {
        if (!alunoRepository.existsById(request.getAlunoId())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Aluno não encontrado."));
        }
        if (!vantagemRepository.existsById(request.getVantagemId())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Vantagem não encontrada."));
        }

        resgateProducer.enviar(request.getAlunoId(), request.getVantagemId());
        return ResponseEntity.accepted().body(Map.of("mensagem", "Processando resgate..."));
    }

    /**
     * POST /api/resgates/solicitar (mantido para compatibilidade)
     */
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
        return ResponseEntity.accepted().body(Map.of("mensagem", "Processando resgate..."));
    }

    /**
     * GET /api/resgates/aluno/{alunoId}
     * Histórico de cupons do aluno.
     */
    @GetMapping("/aluno/{alunoId}")
    public List<ResgateResponse> listarPorAluno(@PathVariable Long alunoId) {
        return resgateRepository.findByAlunoIdOrderByDataResgateDesc(alunoId)
                .stream().map(ResgateResponse::from).toList();
    }

    /**
     * GET /api/resgates/empresa/{empresaId}
     * Lista todos os resgates das vantagens da empresa.
     */
    @GetMapping("/empresa/{empresaId}")
    public List<ResgateResponse> listarPorEmpresa(@PathVariable Long empresaId) {
        return resgateRepository.findByVantagemEmpresaIdOrderByDataResgateDesc(empresaId)
                .stream().map(ResgateResponse::from).toList();
    }

    /**
     * PUT /api/resgates/{id}/confirmar
     * Empresa confirma a entrega/uso de um cupom (muda status para USADO).
     */
    @PutMapping("/{id}/confirmar")
    public ResponseEntity<?> confirmar(@PathVariable Long id) {
        Optional<Resgate> opt = resgateRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Resgate resgate = opt.get();
        resgate.setStatus(Resgate.Status.USADO);
        return ResponseEntity.ok(ResgateResponse.from(resgateRepository.save(resgate)));
    }

    /**
     * GET /api/resgates/cupom/{codigo}
     * Endpoint público para buscar informações de um cupom pelo código (usado na página pública do QR).
     */
    @GetMapping("/cupom/{codigo}")
    public ResponseEntity<?> buscarPorCodigo(@PathVariable String codigo) {
        return resgateRepository.findByCodigoCupom(codigo)
                .map(r -> ResponseEntity.ok(ResgateResponse.from(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT /api/resgates/{id}/usar
     * Marca um cupom como USADO via QR Code scan.
     */
    @PutMapping("/{id}/usar")
    public ResponseEntity<?> usar(@PathVariable Long id) {
        Optional<Resgate> opt = resgateRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Resgate resgate = opt.get();
        if (resgate.getStatus() == Resgate.Status.USADO) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Cupom já utilizado."));
        }
        if (resgate.getStatus() == Resgate.Status.EXPIRADO) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Cupom expirado."));
        }
        resgate.setStatus(Resgate.Status.USADO);
        return ResponseEntity.ok(ResgateResponse.from(resgateRepository.save(resgate)));
    }
}
