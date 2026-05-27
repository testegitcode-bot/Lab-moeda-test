package com.moedaestudantil.dto;

import com.moedaestudantil.model.Resgate;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResgateResponse {
    private Long id;
    private Long vantagemId;
    private String vantagemNome;
    private String empresaNome;
    private Integer custoPago;
    private String codigoCupom;
    private LocalDateTime dataResgate;
    private String status;

    public static ResgateResponse from(Resgate r) {
        ResgateResponse dto = new ResgateResponse();
        dto.setId(r.getId());
        dto.setVantagemId(r.getVantagem().getId());
        dto.setVantagemNome(r.getVantagem().getNome());
        dto.setEmpresaNome(r.getVantagem().getEmpresa().getNome());
        dto.setCustoPago(r.getVantagem().getCusto());
        dto.setCodigoCupom(r.getCodigoCupom());
        dto.setDataResgate(r.getDataResgate());
        dto.setStatus(r.getStatus().name());
        return dto;
    }
}
