package com.inplay.controller;

import com.inplay.entity.Sesion;
import com.inplay.entity.Usuario;
import com.inplay.repository.UsuarioRepository;
import com.inplay.service.SesionService;
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
@RequestMapping("/api/sesiones")
@RequiredArgsConstructor
public class SesionController {

    private final SesionService sesionService;
    private final UsuarioRepository usuarioRepository;

    // Obtener todas (admin/profesor)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")
    @GetMapping
    public ResponseEntity<List<Sesion>> obtenerTodas() {
        return ResponseEntity.ok(sesionService.obtenerSesiones());
    }

    // Obtener por id
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<Sesion> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(sesionService.obtenerPorId(id));
    }

    // Mis sesiones (lo que verá el usuario)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mis-sesiones")
    public ResponseEntity<List<Sesion>> misSesiones(Authentication auth) {

        Usuario usuario = usuarioRepository
                .findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(
                sesionService.obtenerSesionesActivasUsuario(usuario.getId())
        );
    }

    // Disponibilidad (para pintar horas en frontend)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/disponibilidad")
    public ResponseEntity<List<LocalTime>> disponibilidad(
            @RequestParam Integer pistaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        return ResponseEntity.ok(
                sesionService.obtenerSlotsDisponibles(pistaId, fecha)
        );
    }

    // Crear sesión (reservar clase)
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<Sesion> crear(@RequestBody Sesion sesion) {
        return ResponseEntity.status(201).body(
                sesionService.guardarSesion(sesion)
        );
    }

    // Cancelar sesión
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Integer id) {
        sesionService.cancelarSesion(id);
        return ResponseEntity.noContent().build();
    }

    // Sesiones por fecha (admin)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")
    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<Sesion>> porFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        return ResponseEntity.ok(
                sesionService.sesionesPorFecha(fecha)
        );
    }
}
