package com.moedaestudantil.service;

import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.Resgate;
import com.moedaestudantil.model.Vantagem;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.ResgateRepository;
import com.moedaestudantil.repository.VantagemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class ResgateService {

    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final ResgateRepository resgateRepository;
    private final EmailService emailService;

    public ResgateService(AlunoRepository alunoRepository,
                          VantagemRepository vantagemRepository,
                          ResgateRepository resgateRepository,
                          EmailService emailService) {
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
        this.resgateRepository = resgateRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Resgate processar(Long alunoId, Long vantagemId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado: " + alunoId));

        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new IllegalArgumentException("Vantagem não encontrada: " + vantagemId));

        // Validar resgate duplicado apenas para vantagens de resgate único
        if (vantagem.isResgateUnico() && resgateRepository.existsByAlunoIdAndVantagemId(alunoId, vantagemId)) {
            throw new IllegalStateException("Este aluno já resgatou esta vantagem.");
        }

        // Validar validade
        if (vantagem.getDataValidade() != null && vantagem.getDataValidade().isBefore(LocalDate.now())) {
            throw new IllegalStateException("Esta vantagem está expirada.");
        }

        // Validar estoque (evita overbooking em processamento sequencial FIFO)
        if (vantagem.getQuantidadeCupons() != null) {
            int disponivel = vantagem.getQuantidadeCupons() - vantagem.getCuponsResgatados();
            if (disponivel <= 0) {
                throw new IllegalStateException("Cupons esgotados para: " + vantagem.getNome());
            }
        }

        // Validar saldo
        if (aluno.getSaldoMoedas() < vantagem.getCusto()) {
            throw new IllegalStateException("Saldo insuficiente.");
        }

        // Debitar saldo
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCusto());
        alunoRepository.save(aluno);

        // Incrementar cupons resgatados
        vantagem.setCuponsResgatados(vantagem.getCuponsResgatados() + 1);
        vantagemRepository.save(vantagem);

        // Registrar resgate
        Resgate resgate = new Resgate();
        resgate.setAluno(aluno);
        resgate.setVantagem(vantagem);
        resgate.setCodigoCupom(UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());

        Resgate salvo = resgateRepository.save(resgate);

        emailService.enviarEmailResgate(
                aluno.getEmail(),
                aluno.getNome(),
                vantagem.getNome(),
                vantagem.getEmpresa().getNome(),
                salvo.getCodigoCupom()
        );

        return salvo;
    }
}
