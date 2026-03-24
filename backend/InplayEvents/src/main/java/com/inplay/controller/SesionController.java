package com.inplay.controller;

import com.inplay.dto.CrearSesionRequest;
import com.inplay.dto.SesionDisponibilidad;
import com.inplay.dto.SesionProfesorResumen;
import com.inplay.dto.SesionResumen;
import com.inplay.entity.Sesion;
import com.inplay.service.SesionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/sesiones")
@RequiredArgsConstructor
public class SesionController {

    private final SesionService sesionService;


    // Endpoint para crear una nueva sesión
    // Recibe los datos desde el frontend (@RequestBody)
    // Obtiene el usuario logueado desde Spring Security
    // Devuelve la sesión creada con HTTP 201
    @PostMapping
    public ResponseEntity<Sesion> crearSesion(
            @RequestBody CrearSesionRequest request,
            Authentication authentication
    ) {
        Sesion nuevaSesion = sesionService.crearSesion(request, authentication.getName());
        return ResponseEntity.status(201).body(nuevaSesion);
    }


    // Endpoint para obtener todas las sesiones
    // Uso general (debug o admin)
    @GetMapping
    public ResponseEntity<List<Sesion>> obtenerSesiones() {
        return ResponseEntity.ok(sesionService.obtenerSesiones());
    }


    // Endpoint para obtener SOLO las sesiones del usuario logueado
    // Se usa en "Mi cuenta" → Mis clases
    @GetMapping("/mis-sesiones")
    public ResponseEntity<List<SesionResumen>> obtenerMisSesiones(Authentication authentication) {
        return ResponseEntity.ok(
                sesionService.obtenerSesionesDeUsuario(authentication.getName())
        );
    }


    // Endpoint para que profesor/admin vea todas las sesiones creadas
    @GetMapping("/profesor")
    public ResponseEntity<List<SesionProfesorResumen>> obtenerSesionesProfesor() {
        return ResponseEntity.ok(sesionService.obtenerSesionesProfesor());
    }


    // Endpoint para consultar disponibilidad de una sesión concreta
    // Recibe:
    // - idClase
    // - fecha
    // - horaInicio
    // Devuelve:
    // - ocupadas
    // - libres
    // - completa
    @GetMapping("/disponibilidad")
    public ResponseEntity<SesionDisponibilidad> obtenerDisponibilidad(
            @RequestParam Integer idClase,
            @RequestParam String fecha,
            @RequestParam String horaInicio
    ) {
        return ResponseEntity.ok(
                sesionService.obtenerDisponibilidad(
                        idClase,
                        LocalDate.parse(fecha),
                        LocalTime.parse(horaInicio)
                )
        );
    }


    // Endpoint para cancelar una sesión del usuario logueado
    // Recibe el id de la sesión por URL
    // Marca la sesión como inactiva
    // Devuelve HTTP 204 (No Content)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarSesion(
            @PathVariable Integer id,
            Authentication authentication
    ) {
        sesionService.cancelarSesion(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}