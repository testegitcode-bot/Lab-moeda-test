package com.moedaestudantil.dto;

import com.moedaestudantil.model.Transacao;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransacaoResponse {

    private Long id;
    private Long remetenteId;
    private String remetenteNome;
    private Long destinatarioId;
    private String destinatarioNome;
    private Integer quantidade;
    private String mensagem;
    private LocalDateTime criadoEm;

    public static TransacaoResponse from(Transacao t) {
        TransacaoResponse dto = new TransacaoResponse();
        dto.setId(t.getId());
        dto.setRemetenteId(t.getRemetente().getId());
        dto.setRemetenteNome(t.getRemetente().getNome());
        dto.setDestinatarioId(t.getDestinatario().getId());
        dto.setDestinatarioNome(t.getDestinatario().getNome());
        dto.setQuantidade(t.getQuantidade());
        dto.setMensagem(t.getMensagem());
        dto.setCriadoEm(t.getCriadoEm());
        return dto;
    }
}