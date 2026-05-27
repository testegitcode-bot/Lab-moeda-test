package com.moedaestudantil.repository;

import com.moedaestudantil.model.Resgate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResgateRepository extends JpaRepository<Resgate, Long> {
    List<Resgate> findByAlunoIdOrderByDataResgateDesc(Long alunoId);
    long countByVantagemId(Long vantagemId);
    boolean existsByAlunoIdAndVantagemId(Long alunoId, Long vantagemId);
}
