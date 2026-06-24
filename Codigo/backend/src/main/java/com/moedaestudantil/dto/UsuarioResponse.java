package com.moedaestudantil.dto;

import com.moedaestudantil.model.Usuario;
import lombok.Data;

@Data
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private String tipo;
    private Integer saldoMoedas;
    private String curso;
    private String rg;
    private String endereco;
    private String departamento;
    private String cnpj;
    private String descricao;
    private Long instituicaoId;
    private String instituicaoNome;
    private Boolean ativo;

    public static UsuarioResponse from(Usuario usuario) {
        UsuarioResponse dto = new UsuarioResponse();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setTipo(usuario.getTipo().name());

        if (usuario instanceof com.moedaestudantil.model.Aluno aluno) {
            dto.setSaldoMoedas(aluno.getSaldoMoedas() != null ? aluno.getSaldoMoedas() : 0);
            dto.setCurso(aluno.getCurso());
            dto.setRg(aluno.getRg());
            dto.setEndereco(aluno.getEndereco());
            if (aluno.getInstituicao() != null) {
                dto.setInstituicaoId(aluno.getInstituicao().getId());
                dto.setInstituicaoNome(aluno.getInstituicao().getNome());
            }
        } else if (usuario instanceof com.moedaestudantil.model.Professor professor) {
            dto.setSaldoMoedas(professor.getSaldoMoedas() != null ? professor.getSaldoMoedas() : 0);
            dto.setDepartamento(professor.getDepartamento());
            if (professor.getInstituicao() != null) {
                dto.setInstituicaoId(professor.getInstituicao().getId());
                dto.setInstituicaoNome(professor.getInstituicao().getNome());
            }
        } else if (usuario instanceof com.moedaestudantil.model.EmpresaParceira empresa) {
            dto.setCnpj(empresa.getCnpj());
            dto.setDescricao(empresa.getDescricao());
            dto.setAtivo(empresa.isAtivo());
        }

        return dto;
    }
}
