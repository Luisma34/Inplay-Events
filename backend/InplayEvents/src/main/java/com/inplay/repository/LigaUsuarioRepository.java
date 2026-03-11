package com.inplay.repository;

import com.inplay.entity.LigaUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LigaUsuarioRepository extends JpaRepository<LigaUsuario, Integer> {


    boolean existsByLiga_IdAndUsuario_Id(Integer ligaId, Integer usuarioId);
}
