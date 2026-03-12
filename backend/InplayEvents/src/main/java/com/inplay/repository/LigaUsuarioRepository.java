package com.inplay.repository;

import com.inplay.entity.LigaUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LigaUsuarioRepository extends JpaRepository<LigaUsuario, Integer> {


    boolean existsByLiga_IdAndUsuario_Id(Integer ligaId, Integer usuarioId);

    Optional<LigaUsuario> findByLiga_idAndUsuario_Id(Integer ligaId, Integer usuarioId);

    List<LigaUsuario> findByUsuario_Id(Integer usuarioId);
}
