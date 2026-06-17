package com.moedaestudantil.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.moedaestudantil.model.Vantagem;
import lombok.Data;

import java.time.LocalDate;

@Data
public class VantagemResponse {
    private Long id;
    private String nome;
    private String descricao;
    private Integer custo;
    private Integer quantidadeCupons;
    private Integer cuponsResgatados;
    private LocalDate dataValidade;
    @JsonProperty("isResgateUnico")
    private boolean resgateUnico;
    private Long empresaId;
    private String empresaNome;

    public static VantagemResponse from(Vantagem v) {
        VantagemResponse dto = new VantagemResponse();
        dto.setId(v.getId());
        dto.setNome(v.getNome());
        dto.setDescricao(v.getDescricao());
        dto.setCusto(v.getCusto());
        dto.setQuantidadeCupons(v.getQuantidadeCupons());
        dto.setCuponsResgatados(v.getCuponsResgatados());
        dto.setDataValidade(v.getDataValidade());
        dto.setResgateUnico(v.isResgateUnico());
        dto.setEmpresaId(v.getEmpresa().getId());
        dto.setEmpresaNome(v.getEmpresa().getNome());
        return dto;
    }
}
