package com.moedaestudantil.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Classe de configuração do RabbitMQ.
 * Define os componentes necessários para a mensageria e garante a consistência do sistema.
 */
@Configuration
public class RabbitMQConfig {

    // Nome oficial da fila que será criada e monitorada no servidor do RabbitMQ
    public static final String RESGATE_QUEUE = "vantagens.resgate.queue";

    /**
     * Define a fila de resgate de vantagens.
     * O segundo parâmetro 'true' define a fila como DURÁVEL.
     * Isso significa que se o servidor do RabbitMQ reiniciar, a fila e as mensagens não se perdem.
     */
    @Bean
    public Queue resgateQueue() {
        return new Queue(RESGATE_QUEUE, true);
    }

    /**
     * Configura o conversor de mensagens para usar JSON (Jackson).
     * Por padrão, o RabbitMQ envia objetos como bytes serializados do Java (difíceis de ler).
     * Convertendo para JSON, as mensagens trafegam em formato texto legível, facilitando auditorias.
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    /**
     * Abstração do Spring (Template) utilizada pelo 'Producer' para enviar mensagens à fila.
     * Aqui nós injetamos a fábrica de conexões e o conversor JSON definido acima.
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }

    /**
     * Configura o container que gerencia os ouvintes (Listeners / Consumers) da fila.
     * PONTO CRÍTICO PARA A SEGURANÇA DO SISTEMA:
     * Definindo ConcurrentConsumers e MaxConcurrentConsumers como 1, garantimos que apenas
     * UMA thread processará a fila por vez. Isso força um comportamento FIFO (First-In, First-Out)
     * estrito e isolado, eliminando completamente condições de corrida (Race Conditions)
     * na hora de validar saldo e estoque no banco de dados.
     */
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jsonMessageConverter());

        // Garante processamento estritamente sequencial (Fila Indiana Indiana Perfeita)
        factory.setConcurrentConsumers(1);
        factory.setMaxConcurrentConsumers(1);

        return factory;
    }
}