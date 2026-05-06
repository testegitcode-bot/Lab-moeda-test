package com.moedaestudantil.dto;

import lombok.Data;

@Data
public class VantagemRequest {
    private String nome;
    private String descricao;
    private String fotoUrl;
    private Integer custo;
}
