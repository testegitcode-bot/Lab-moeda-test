package com.moedaestudantil.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResgateRequest {

    @NotNull(message = "ID do aluno é obrigatório")
    private Long alunoId;

    @NotNull(message = "ID da vantagem é obrigatório")
    private Long vantagemId;
}
