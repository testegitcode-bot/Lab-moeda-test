package com.moedaestudantil.controller;

import com.moedaestudantil.dto.VantagemRequest;
import com.moedaestudantil.dto.VantagemResponse;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.model.Vantagem;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import com.moedaestudantil.repository.VantagemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vantagens")
public class VantagemController {

    private final VantagemRepository vantagemRepository;
    private final EmpresaParceiraRepository empresaRepository;

    public VantagemController(VantagemRepository vantagemRepository,
                               EmpresaParceiraRepository empresaRepository) {
        this.vantagemRepository = vantagemRepository;
        this.empresaRepository = empresaRepository;
    }

    // Lista todas as vantagens ativas (para o catálogo do aluno)
    @GetMapping
    public List<VantagemResponse> listarTodas() {
        return vantagemRepository.findAll()
                .stream().map(VantagemResponse::from).toList();
    }

    @GetMapping("/empresa/{empresaId}")
    public List<VantagemResponse> listarPorEmpresa(@PathVariable Long empresaId) {
        return vantagemRepository.findByEmpresaId(empresaId)
                .stream().map(VantagemResponse::from).toList();
    }

    @PostMapping("/empresa/{empresaId}")
    public ResponseEntity<?> criar(@PathVariable Long empresaId, @RequestBody VantagemRequest request) {
        Optional<EmpresaParceira> empresaOpt = empresaRepository.findById(empresaId);
        if (empresaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Empresa não encontrada."));
        }

        Vantagem v = new Vantagem();
        v.setNome(request.getNome());
        v.setDescricao(request.getDescricao());
        v.setCusto(request.getCusto());
        v.setQuantidadeCupons(request.getQuantidadeCupons());
        v.setDataValidade(request.getDataValidade());
        // Vantagens com prazo sempre são de resgate único
        if (request.getDataValidade() != null) {
            v.setResgateUnico(true);
        } else {
            v.setResgateUnico(request.getIsResgateUnico() == null || request.getIsResgateUnico());
        }
        v.setEmpresa(empresaOpt.get());

        return ResponseEntity.ok(VantagemResponse.from(vantagemRepository.save(v)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody VantagemRequest request) {
        Optional<Vantagem> opt = vantagemRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Vantagem v = opt.get();
        v.setNome(request.getNome());
        v.setDescricao(request.getDescricao());
        v.setCusto(request.getCusto());
        v.setQuantidadeCupons(request.getQuantidadeCupons());
        v.setDataValidade(request.getDataValidade());
        if (request.getDataValidade() != null) {
            v.setResgateUnico(true);
        } else {
            v.setResgateUnico(request.getIsResgateUnico() == null || request.getIsResgateUnico());
        }

        return ResponseEntity.ok(VantagemResponse.from(vantagemRepository.save(v)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        if (!vantagemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        vantagemRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensagem", "Vantagem removida com sucesso."));
    }
}
