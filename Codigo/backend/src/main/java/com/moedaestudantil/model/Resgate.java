package com.moedaestudantil.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resgate")
@Data
@NoArgsConstructor
public class Resgate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vantagem_id", nullable = false)
    private Vantagem vantagem;

    @Column(nullable = false)
    private LocalDateTime dataResgate = LocalDateTime.now();

    // código do cupom gerado para o aluno
    @Column(nullable = false, unique = true, length = 20)
    private String codigoCupom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ATIVO;

    public enum Status {
        ATIVO, USADO, EXPIRADO
    }
}
