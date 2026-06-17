package com.moedaestudantil.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class VantagemRequest {
    private String nome;
    private String descricao;
    private Integer custo;
    // null = ilimitado
    private Integer quantidadeCupons;
    // null = indeterminado
    private LocalDate dataValidade;
    // true = resgate único por aluno; false = múltiplos resgates
    private Boolean isResgateUnico;
}
