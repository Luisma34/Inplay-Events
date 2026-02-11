package com.inplay.controller;


import com.inplay.entity.Reserva;
import com.inplay.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    //ResponseEntity -> respuesta HTTP con código de estado y cuerpo.
    @GetMapping
    public ResponseEntity<List<Reserva>> getReservas() {
        List<Reserva> reservas = reservaService.obtenerReservas();
        return ResponseEntity.ok(reservas);
    }

    //Obtener cada reserva por su id.
    @GetMapping("/{id}")
    public ResponseEntity<Reserva> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(reservaService.obtenerPorId(id));
    }

    // @RequestBody -> convierte el JSON del cuerpo de la solicitud en un objeto Reserva.
    // @PostMapping -> maneja solicitudes POST para crear una nueva reserva.
    @PostMapping
    public ResponseEntity<Reserva> crear(@RequestBody Reserva reserva) {
        Reserva creada = reservaService.guardarReserva(reserva);
        return ResponseEntity.ok(creada);
    }

    // @DeleteMapping -> maneja solicitudes DELETE para cancelar una reserva por su ID.
    // @PathVariable -> extrae el ID de la URL para identificar qué reserva cancelar.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Integer id) {
        reservaService.cancelarReserva(id);
        return ResponseEntity.noContent().build();
    }

    // @GetMapping("/fecha/{fecha}") -> maneja solicitudes GET para obtener reservas por fecha.
    // @PathVariable LocalDate fecha -> extrae la fecha de la URL y la convierte en un objeto LocalDate.
    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<Reserva>> porFecha(@PathVariable LocalDate fecha) {
        List<Reserva> reservas = reservaService.reservasPorFecha(fecha);
        return ResponseEntity.ok(reservas);
    }
}
