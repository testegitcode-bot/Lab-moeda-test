package com.moedaestudantil.repository;

import com.moedaestudantil.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    // Extrato do professor: transações enviadas
    List<Transacao> findByRemetenteIdOrderByCriadoEmDesc(Long professorId);

    // Extrato do aluno: transações recebidas
    List<Transacao> findByDestinatarioIdOrderByCriadoEmDesc(Long alunoId);
}