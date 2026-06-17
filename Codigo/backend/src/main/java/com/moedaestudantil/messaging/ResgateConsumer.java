package com.moedaestudantil.messaging;

import com.moedaestudantil.config.RabbitMQConfig;
import com.moedaestudantil.service.ResgateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ResgateConsumer {

    private static final Logger log = LoggerFactory.getLogger(ResgateConsumer.class);
    private final ResgateService resgateService;

    public ResgateConsumer(ResgateService resgateService) {
        this.resgateService = resgateService;
    }

    // concurrency=1 no container garante FIFO estrito sem concorrência destrutiva
    @RabbitListener(queues = RabbitMQConfig.RESGATE_QUEUE)
    public void consumir(ResgateMessage message) {
        log.info("Processando resgate: alunoId={} vantagemId={}", message.getAlunoId(), message.getVantagemId());
        try {
            resgateService.processar(message.getAlunoId(), message.getVantagemId());
            log.info("Resgate concluído: alunoId={} vantagemId={}", message.getAlunoId(), message.getVantagemId());
        } catch (IllegalStateException e) {
            // Violação de regra de negócio (duplicata, saldo insuficiente, estoque zerado, expirado)
            // Mensagem descartada com ACK para não gerar loop na fila
            log.warn("Resgate recusado (regra de negócio): alunoId={} vantagemId={} | motivo: {}",
                    message.getAlunoId(), message.getVantagemId(), e.getMessage());
        } catch (Exception e) {
            // Erro inesperado (banco fora, NPE, etc.) — também descartamos para evitar loop infinito
            log.error("Resgate falhou com erro inesperado: {} | motivo: {}", message, e.getMessage(), e);
        }
    }
}
