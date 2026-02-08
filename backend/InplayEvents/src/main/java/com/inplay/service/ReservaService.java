package com.inplay.service;

import com.inplay.entity.Reserva;
import com.inplay.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;

    public Reserva guardarReserva(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    public void cancelarReserva(Integer id) {
        reservaRepository.deleteById(id);
    }

    public List<Reserva> obtenerReservas() {
        return reservaRepository.findAll();
    }

    public List<Reserva> reservasPorFecha(LocalDate fecha) {
        return reservaRepository.findByFecha(fecha);
    }
}

