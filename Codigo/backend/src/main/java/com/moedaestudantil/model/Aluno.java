package com.moedaestudantil.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "aluno")
@PrimaryKeyJoinColumn(name = "id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Aluno extends Usuario {

    @Column(length = 11, unique = true)
    private String cpf;

    @Column(length = 20)
    private String rg;

    private String endereco;

    private String curso;

    @Column(name = "saldo_moedas")
    private Integer saldoMoedas = 0;

    // Isolado de listagens públicas e relatórios; usado exclusivamente para testes
    @Column(name = "is_test_user")
    private Boolean isTestUser = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instituicao_id")
    private Instituicao instituicao;
}
