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

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Integer> {

    // Devuelve todas las sesiones de un usuario
    // Lo usaremos para "mis clases"
    List<Sesion> findByUsuario_Id(Integer usuarioId);

    // Devuelve sesiones de una fecha concreta
    // Esto sirve para panel admin o control de sesiones
    List<Sesion> findByFecha(LocalDate fecha);

    // Devuelve sesiones de una pista en una fecha
    // Nos sirve para ver qué hay reservado en esa pista
    List<Sesion> findByPista_IdAndFecha(Integer pistaId, LocalDate fecha);

    // Devuelve solo sesiones activas de un usuario
    // Esto es lo que realmente verá el usuario en "mis clases"
    List<Sesion> findByUsuario_IdAndActivaTrue(Integer usuarioId);

    // Devuelve sesiones activas de una pista en una fecha
    // Esto lo usamos para calcular disponibilidad
    List<Sesion> findByPista_IdAndFechaAndActivaTrue(Integer pistaId, LocalDate fecha);

    // Comprueba si ya existe una sesión activa en esa pista, fecha y hora
    // Esto es clave para evitar que dos usuarios reserven el mismo hueco
    boolean existsByPista_IdAndFechaAndHoraInicioAndActivaTrue(
            Integer pistaId,
            LocalDate fecha,
            LocalTime horaInicio
    );

    // Metodo para eliminar sesiones antiguas que ya no estén activas
    // Esto lo usamos en el scheduled del service para limpiar la BD
    @Modifying
    @Transactional
    @Query("DELETE FROM Sesion sesion WHERE sesion.fecha < :limite AND sesion.activa = false")
    void borrarSesionesAntiguas(@Param("limite") LocalDate limite);
}
