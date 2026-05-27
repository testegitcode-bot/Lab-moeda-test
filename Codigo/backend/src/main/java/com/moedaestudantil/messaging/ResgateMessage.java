package com.moedaestudantil.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResgateMessage implements Serializable {
    private Long alunoId;
    private Long vantagemId;
}
