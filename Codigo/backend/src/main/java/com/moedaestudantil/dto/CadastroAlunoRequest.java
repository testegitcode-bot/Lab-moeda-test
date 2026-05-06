package com.moedaestudantil.dto;

import lombok.Data;

@Data
public class CadastroAlunoRequest {
    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private String rg;
    private String endereco;
    private String curso;
    private Long instituicaoId;
}
