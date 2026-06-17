package com.moedaestudantil.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "vantagem")
@Data
@NoArgsConstructor
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private Integer custo;

    // null = ilimitado; valor positivo = quantidade máxima de cupons
    @Column(name = "quantidade_cupons")
    private Integer quantidadeCupons;

    // rastreia quantos cupons já foram resgatados
    @Column(name = "cupons_resgatados", nullable = false, columnDefinition = "integer default 0")
    private int cuponsResgatados = 0;

    // null = indeterminado; data futura = prazo de expiração
    @Column(name = "data_validade")
    private LocalDate dataValidade;

    // true = resgate único por aluno (padrão quando há dataValidade); false = múltiplos resgates permitidos
    @Column(name = "is_resgate_unico", nullable = false, columnDefinition = "boolean default true")
    private boolean resgateUnico = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaParceira empresa;
}
