package com.inplay.service;

import com.inplay.entity.Pista;
import com.inplay.entity.Reserva;
import com.inplay.entity.Usuario;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.PistaRepository;
import com.inplay.repository.ReservaRepository;
import com.inplay.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PistaRepository pistaRepository;

    public Reserva guardarReserva(Reserva reserva) {

        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();

        // Validar fecha no pasada
        if (reserva.getFecha().isBefore(hoy)) {
            throw new IllegalStateException("No se puede reservar en días anteriores");
        }

        // No permitir horas pasadas para el mismo día
        if (reserva.getFecha().isEqual(hoy) && reserva.getHora().isBefore(ahora)) {
            throw new IllegalStateException("No se puede reservar una hora que ya pasó");
        }

        // Validar usuario real desde BD
        Usuario usuario = usuarioRepository.findById(reserva.getUsuario().getId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        // Cargar pista real desde BD
        Pista pista = pistaRepository
                .findById(reserva.getPista().getId())
                .orElseThrow(() -> new RuntimeException("Pista no encontrada"));

        reserva.setUsuario(usuario);
        reserva.setPista(pista);

        // Validación de disponibilidad (evita doble reserva)
        boolean existe = reservaRepository
                .existsByPista_IdAndFechaAndHora(
                        reserva.getPista().getId(),
                        reserva.getFecha(),
                        reserva.getHora()
                );

        if (existe) {
            throw new IllegalStateException("La hora seleccionada ya está ocupada");
        }

        return reservaRepository.save(reserva);
    }

    // Obtener reservas de un usuario específico
    public List<Reserva> obtenerReservasUsuario(Integer usuarioId) {
        return reservaRepository.findByUsuario_Id(usuarioId);
    }

    public void cancelarReserva(Integer id) {
        reservaRepository.deleteById(id);
    }

    public List<Reserva> obtenerReservas() {
        return reservaRepository.findAll();
    }

    public Reserva obtenerPorId(Integer id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Reserva no encontrada"));
    }

    public List<Reserva> reservasPorFecha(LocalDate fecha) {
        return reservaRepository.findByFecha(fecha);
    }

    public List<LocalTime> obtenerSlotsDisponibles(Integer pistaId, LocalDate fecha) {

        //  Generamos todos los slots posibles
        List<LocalTime> todosLosSlots = new ArrayList<>();
        for (int h = 8; h <= 22; h++) {
            todosLosSlots.add(LocalTime.of(h, 0));
        }

        // Obtenemos reservas existentes
        List<Reserva> reservas = reservaRepository
                .findByPista_IdAndFecha(pistaId, fecha);

        // Extraemos horas ocupadas
        Set<LocalTime> horasOcupadas = reservas.stream()
                .map(Reserva::getHora)
                .collect(Collectors.toSet());

        //  Filtramos slots disponibles, excluyendo horas ocupadas y horas pasadas si es el mismo día
        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();

        return todosLosSlots.stream()
                .filter(slot -> !horasOcupadas.contains(slot))
                .filter(slot -> !(fecha.isEqual(hoy) && slot.isBefore(ahora)))
                .toList();
    }
}

