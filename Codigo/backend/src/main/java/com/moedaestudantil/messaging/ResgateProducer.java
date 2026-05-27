package com.moedaestudantil.messaging;

import com.moedaestudantil.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class ResgateProducer {

    private final RabbitTemplate rabbitTemplate;

    public ResgateProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void enviar(Long alunoId, Long vantagemId) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.RESGATE_QUEUE, new ResgateMessage(alunoId, vantagemId));
    }
}
