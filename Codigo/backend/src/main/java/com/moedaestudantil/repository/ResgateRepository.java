package com.moedaestudantil.repository;

import com.moedaestudantil.model.Resgate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResgateRepository extends JpaRepository<Resgate, Long> {
    List<Resgate> findByAlunoIdOrderByDataResgateDesc(Long alunoId);
    List<Resgate> findByVantagemEmpresaIdOrderByDataResgateDesc(Long empresaId);
    long countByVantagemId(Long vantagemId);
    boolean existsByAlunoIdAndVantagemId(Long alunoId, Long vantagemId);
    Optional<Resgate> findByCodigoCupom(String codigoCupom);

    @Transactional
    void deleteByAlunoId(Long alunoId);

    @Transactional
    void deleteByVantagemId(Long vantagemId);
}
