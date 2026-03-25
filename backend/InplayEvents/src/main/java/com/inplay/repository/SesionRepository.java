package com.inplay.repository;

import com.inplay.entity.Sesion;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Integer> {

    // Limpieza automática
    @Modifying
    @Transactional
    @Query("DELETE FROM Sesion s WHERE s.fecha < :limite AND s.activa = false")
    void borrarSesionesAntiguas(@Param("limite") LocalDate limite);

    // Sesiones del usuario logueado
    List<Sesion> findByUsuarioEmail(String email);

    // Buscar una sesión concreta que pertenezca al usuario logueado
    Optional<Sesion> findByIdAndUsuarioEmail(Integer id, String email);

    // Comprobar si el usuario ya tiene una sesión que se solapa en esa fecha
    @Query("""
        SELECT COUNT(s) > 0
        FROM Sesion s
        WHERE s.usuario.email = :email
          AND s.fecha = :fecha
          AND s.activa = true
          AND :horaInicio < s.horaFin
          AND :horaFin > s.horaInicio
    """)
    boolean existeSolapeUsuario(
            @Param("email") String email,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

    // Cuenta cuántos usuarios hay ya apuntados a una clase concreta
    // en una fecha y una hora de inicio concretas
    long countByClaseIdAndFechaAndHoraInicioAndActivaTrue(
            Integer idClase,
            LocalDate fecha,
            LocalTime horaInicio
    );


}