package com.inplay.repository;

import com.inplay.entity.Rol;
import com.inplay.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Spring genera la consulta automáticamente.
    List<Usuario> findByActiveTrue();

    // Busca un usuario por email (login)
    // Optional: porque puede existir o no (evita nulls)
    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByActiveTrueAndRol_RolNot(Rol.RolUsuario rol);
}
