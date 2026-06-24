package com.moedaestudantil.repository;

import com.moedaestudantil.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByRemetenteIdOrderByCriadoEmDesc(Long professorId);
    List<Transacao> findByDestinatarioIdOrderByCriadoEmDesc(Long alunoId);

    @Transactional
    void deleteByRemetenteId(Long professorId);

    @Transactional
    void deleteByDestinatarioId(Long alunoId);
}
