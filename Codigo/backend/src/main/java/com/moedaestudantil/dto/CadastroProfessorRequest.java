package com.moedaestudantil.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CadastroProfessorRequest(

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        String senha,

        @NotBlank(message = "CPF é obrigatório")
        String cpf,

        @NotBlank(message = "Departamento é obrigatório")
        String departamento,

        @NotNull(message = "Instituição é obrigatória")
        Long instituicaoId
) {}
