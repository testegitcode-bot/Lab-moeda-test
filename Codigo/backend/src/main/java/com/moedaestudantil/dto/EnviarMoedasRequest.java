package com.moedaestudantil.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EnviarMoedasRequest {

    @NotNull(message = "ID do professor é obrigatório")
    private Long professorId;

    @NotNull(message = "ID do aluno é obrigatório")
    private Long alunoId;

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade mínima é 1")
    private Integer quantidade;

    private String mensagem;
}