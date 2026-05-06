package com.moedaestudantil.dto;

import com.moedaestudantil.model.Vantagem;
import lombok.Data;

@Data
public class VantagemResponse {
    private Long id;
    private String nome;
    private String descricao;
    private String fotoUrl;
    private Integer custo;
    private Long empresaId;
    private String empresaNome;

    public static VantagemResponse from(Vantagem v) {
        VantagemResponse dto = new VantagemResponse();
        dto.setId(v.getId());
        dto.setNome(v.getNome());
        dto.setDescricao(v.getDescricao());
        dto.setFotoUrl(v.getFotoUrl());
        dto.setCusto(v.getCusto());
        dto.setEmpresaId(v.getEmpresa().getId());
        dto.setEmpresaNome(v.getEmpresa().getNome());
        return dto;
    }
}
