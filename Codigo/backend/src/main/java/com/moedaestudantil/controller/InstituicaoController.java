package com.moedaestudantil.controller;

import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.repository.InstituicaoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoController {

    private final InstituicaoRepository instituicaoRepository;

    public InstituicaoController(InstituicaoRepository instituicaoRepository) {
        this.instituicaoRepository = instituicaoRepository;
    }

    @GetMapping
    public List<Instituicao> listar() {
        return instituicaoRepository.findAll();
    }
}
