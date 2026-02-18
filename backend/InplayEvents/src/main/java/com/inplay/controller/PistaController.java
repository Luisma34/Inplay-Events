package com.inplay.controller;

import com.inplay.entity.Pista;
import com.inplay.service.PistaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pistas")
@RequiredArgsConstructor
public class PistaController {

    private final PistaService pistaService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Pista>> obtenerTodas() {
        List<Pista> pistas = pistaService.obtenerTodas();
        return ResponseEntity.ok(pistas);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")

    @PostMapping
    public ResponseEntity<Pista> crear(@RequestBody Pista pista) {
        Pista creada = pistaService.guardar(pista);
        return ResponseEntity.status(201).body(creada);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Pista> actualizar(
            @PathVariable Integer id,
            @RequestBody Pista pista) {

        return ResponseEntity.ok(pistaService.actualizar(id, pista));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        pistaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
