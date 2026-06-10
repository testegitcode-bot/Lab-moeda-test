package com.moedaestudantil.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "professor")
@PrimaryKeyJoinColumn(name = "id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Professor extends Usuario {

    private String departamento;

    @Column(name = "saldo_moedas")
    private Integer saldoMoedas = 0;

    @Column(length = 11, unique = true)
    private String cpf;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instituicao_id")
    private Instituicao instituicao;
}
