package com.inplay.repository;

import com.inplay.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {

    // Busca un Rol por el valor del enum (ROLE_ADMIN, ROLE_USUARIO, etc.)
    // Spring genera automáticamente la consulta.
    Optional<Rol> findByRol(Rol.RolUsuario rol);
}
