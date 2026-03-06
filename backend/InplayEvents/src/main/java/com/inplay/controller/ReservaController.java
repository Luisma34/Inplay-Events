package com.inplay.controller;


import com.inplay.entity.Reserva;
import com.inplay.entity.Usuario;
import com.inplay.repository.UsuarioRepository;
import com.inplay.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;
    private final UsuarioRepository usuarioRepository;

    //ResponseEntity -> respuesta HTTP con código de estado y cuerpo.
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Reserva>> getReservas() {
        List<Reserva> reservas = reservaService.obtenerReservas();
        return ResponseEntity.ok(reservas);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/disponibilidad")
    public List<LocalTime> disponibilidad(
            @RequestParam Integer pistaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        return reservaService.obtenerSlotsDisponibles(pistaId, fecha);
    }

    // @RequestBody -> convierte el JSON del cuerpo de la solicitud en un objeto Reserva.
    // @PostMapping -> maneja solicitudes POST para crear una nueva reserva.
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<Reserva> crear(@RequestBody Reserva reserva) {
        Reserva creada = reservaService.guardarReserva(reserva);
        return ResponseEntity.ok(creada);
    }

    // @GetMapping("/mis-reservas") -> maneja solicitudes GET para obtener las reservas del usuario autenticado.
    // Authentication auth -> proporciona información sobre el usuario autenticado, como su nombre de usuario (email).
    // usuarioRepository.findByEmail(auth.getName()) -> busca el usuario en la base de datos usando su email.
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mis-reservas")
    public List<Reserva> misReservas(Authentication auth) {

        Usuario usuario = usuarioRepository
                .findByEmail(auth.getName())
                .orElseThrow();

        return reservaService.obtenerReservasUsuario(usuario.getId());
    }

    // @DeleteMapping -> maneja solicitudes DELETE para cancelar una reserva por su ID.
    // @PathVariable -> extrae el ID de la URL para identificar qué reserva cancelar.
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Integer id) {
        reservaService.cancelarReserva(id);
        return ResponseEntity.noContent().build();
    }

    // @GetMapping("/fecha/{fecha}") -> maneja solicitudes GET para obtener reservas por fecha.
    // @PathVariable LocalDate fecha -> extrae la fecha de la URL y la convierte en un objeto LocalDate.
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<Reserva>> porFecha(@PathVariable LocalDate fecha) {
        List<Reserva> reservas = reservaService.reservasPorFecha(fecha);
        return ResponseEntity.ok(reservas);
    }
}
