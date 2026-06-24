package com.moedaestudantil.controller;

import com.moedaestudantil.dto.UsuarioResponse;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.model.Vantagem;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import com.moedaestudantil.repository.ResgateRepository;
import com.moedaestudantil.repository.VantagemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaParceiraRepository empresaRepository;
    private final VantagemRepository vantagemRepository;
    private final ResgateRepository resgateRepository;

    public EmpresaController(EmpresaParceiraRepository empresaRepository,
                              VantagemRepository vantagemRepository,
                              ResgateRepository resgateRepository) {
        this.empresaRepository = empresaRepository;
        this.vantagemRepository = vantagemRepository;
        this.resgateRepository = resgateRepository;
    }

    @GetMapping
    public List<UsuarioResponse> listarTodas() {
        return empresaRepository.findAll()
                .stream().map(UsuarioResponse::from).toList();
    }

    @PutMapping("/{id}/ativo")
    public ResponseEntity<?> toggleAtivo(@PathVariable Long id) {
        Optional<EmpresaParceira> opt = empresaRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        EmpresaParceira empresa = opt.get();
        empresa.setAtivo(!empresa.isAtivo());
        return ResponseEntity.ok(UsuarioResponse.from(empresaRepository.save(empresa)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        Optional<EmpresaParceira> opt = empresaRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        List<Vantagem> vantagens = vantagemRepository.findByEmpresaId(id);
        for (Vantagem v : vantagens) {
            resgateRepository.deleteByVantagemId(v.getId());
        }
        vantagemRepository.deleteAll(vantagens);
        empresaRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("mensagem", "Empresa removida com sucesso."));
    }
}
