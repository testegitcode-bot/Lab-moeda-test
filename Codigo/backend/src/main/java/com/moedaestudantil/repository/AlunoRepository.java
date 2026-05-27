package com.moedaestudantil.repository;

import com.moedaestudantil.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    // Exclui usuários de teste de listagens públicas e relatórios
    List<Aluno> findByIsTestUserFalse();
}
