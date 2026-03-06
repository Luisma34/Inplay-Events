package com.inplay.repository;

import com.inplay.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

    List<Reserva> findByFecha(LocalDate fecha);

    List<Reserva> findByPista_IdAndFecha(Integer pistaId, LocalDate fecha);

    List<Reserva> findByUsuario_Id(Integer usuarioId);

    boolean existsByPista_IdAndFechaAndHora(Integer pistaId, LocalDate fecha, LocalTime hora);
}
