package com.moedaestudantil.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void enviarEmailMoedas(String toEmail, String alunoNome, String professorNome,
                                   int quantidade, String mensagem) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Você recebeu " + quantidade + " moedas no Meritum!");
            helper.setText(buildCoinEmailHtml(alunoNome, professorNome, quantidade, mensagem), true);
            mailSender.send(message);
            log.info("E-mail de moedas enviado para {}", toEmail);
        } catch (Exception e) {
            log.warn("Não foi possível enviar e-mail de moedas para {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void enviarEmailResgate(String toEmail, String alunoNome, String vantagemNome,
                                    String empresaNome, String codigoCupom) {
        try {
            String cupomUrl = frontendUrl + "/cupom/" + codigoCupom;
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Seu cupom: " + vantagemNome);
            helper.setText(buildCouponEmailHtml(alunoNome, vantagemNome, empresaNome, codigoCupom, cupomUrl), true);
            mailSender.send(message);
            log.info("E-mail de resgate enviado para {}", toEmail);
        } catch (Exception e) {
            log.warn("Não foi possível enviar e-mail de resgate para {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildCoinEmailHtml(String alunoNome, String professorNome, int quantidade, String mensagem) {
        String mensagemHtml = (mensagem != null && !mensagem.isBlank())
                ? "<p style=\"background:#f0fdf4;border-left:4px solid #22c55e;padding:12px 16px;border-radius:4px;color:#166534;font-style:italic;margin:16px 0;\">&ldquo;" + escapeHtml(mensagem) + "&rdquo;</p>"
                : "";
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f9fafb;font-family:sans-serif;'>"
                + "<div style='max-width:520px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);'>"
                + "<div style='background:linear-gradient(135deg,#d97706,#b45309);padding:32px 32px 24px;text-align:center;'>"
                + "<img src='https://img.icons8.com/emoji/96/coin-emoji.png' width='56' height='56' alt='moeda' style='display:block;margin:0 auto 12px;'/>"
                + "<h1 style='color:#fff;margin:0;font-size:22px;font-weight:700;'>Você recebeu moedas!</h1>"
                + "</div>"
                + "<div style='padding:28px 32px;'>"
                + "<p style='color:#374151;font-size:16px;margin-top:0;'>Olá, <strong>" + escapeHtml(alunoNome) + "</strong>!</p>"
                + "<p style='color:#6b7280;font-size:15px;line-height:1.6;'>"
                + "<strong>" + escapeHtml(professorNome) + "</strong> te enviou moedas Meritum."
                + "</p>"
                + "<div style='background:#fffbeb;border:2px solid #f59e0b;border-radius:12px;padding:20px;text-align:center;margin:20px 0;'>"
                + "<p style='margin:0 0 4px;color:#92400e;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;'>Moedas recebidas</p>"
                + "<p style='margin:0;font-size:48px;font-weight:800;color:#d97706;'>" + quantidade + "</p>"
                + "</div>"
                + mensagemHtml
                + "<p style='color:#9ca3af;font-size:13px;margin-top:24px;'>Use suas moedas na loja de vantagens do Meritum.</p>"
                + "</div>"
                + "<div style='background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;'>"
                + "<p style='color:#9ca3af;font-size:12px;margin:0;'>Meritum &mdash; Sistema de Moeda Estudantil</p>"
                + "</div>"
                + "</div></body></html>";
    }

    private String buildCouponEmailHtml(String alunoNome, String vantagemNome, String empresaNome,
                                         String codigoCupom, String cupomUrl) {
        String qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data="
                + URLEncoder.encode(cupomUrl, StandardCharsets.UTF_8);
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f9fafb;font-family:sans-serif;'>"
                + "<div style='max-width:520px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);'>"
                + "<div style='background:linear-gradient(135deg,#1d4ed8,#1e40af);padding:32px 32px 24px;text-align:center;'>"
                + "<h1 style='color:#fff;margin:0;font-size:22px;font-weight:700;'>Seu cupom foi gerado!</h1>"
                + "<p style='color:#bfdbfe;margin:8px 0 0;font-size:15px;'>Guarde este e-mail com carinho</p>"
                + "</div>"
                + "<div style='padding:28px 32px;'>"
                + "<p style='color:#374151;font-size:16px;margin-top:0;'>Olá, <strong>" + escapeHtml(alunoNome) + "</strong>!</p>"
                + "<p style='color:#6b7280;font-size:15px;line-height:1.6;'>Você resgatou a vantagem <strong>"
                + escapeHtml(vantagemNome) + "</strong> de <strong>" + escapeHtml(empresaNome) + "</strong>.</p>"
                + "<div style='background:#f0f9ff;border:2px dashed #93c5fd;border-radius:12px;padding:20px;text-align:center;margin:20px 0;'>"
                + "<p style='margin:0 0 6px;color:#1e40af;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;'>Código do Cupom</p>"
                + "<p style='margin:0;font-size:26px;font-weight:800;color:#1d4ed8;letter-spacing:4px;font-family:monospace;'>"
                + escapeHtml(codigoCupom) + "</p>"
                + "</div>"
                + "<div style='text-align:center;margin:24px 0;'>"
                + "<p style='color:#6b7280;font-size:13px;margin-bottom:12px;'>Escaneie o QR Code para acessar seu cupom</p>"
                + "<img src='" + qrUrl + "' width='180' height='180' alt='QR Code do cupom' style='border:1px solid #e5e7eb;border-radius:8px;padding:8px;background:#fff;'/>"
                + "</div>"
                + "<div style='text-align:center;'>"
                + "<a href='" + cupomUrl + "' style='display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;'>Ver Cupom Online</a>"
                + "</div>"
                + "</div>"
                + "<div style='background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;'>"
                + "<p style='color:#9ca3af;font-size:12px;margin:0;'>Meritum &mdash; Sistema de Moeda Estudantil</p>"
                + "</div>"
                + "</div></body></html>";
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                   .replace("\"", "&quot;").replace("'", "&#39;");
    }
}
