package com.moedaestudantil.dto;

import lombok.Data;

@Data
public class CadastroEmpresaRequest {
    private String nome;
    private String email;
    private String senha;
    private String cnpj;
    private String descricao;
}
