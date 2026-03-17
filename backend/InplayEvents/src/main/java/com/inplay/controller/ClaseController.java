package com.inplay.controller;

import com.inplay.entity.Clase;
import com.inplay.service.ClaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clases")
@RequiredArgsConstructor
public class ClaseController {

    private final ClaseService claseService;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")
    @PostMapping
    public ResponseEntity<Clase> crear(@RequestBody Clase clase) {
        return ResponseEntity.status(201).body(claseService.guardar(clase));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Clase>> obtenerTodas() {
        return ResponseEntity.ok(claseService.obtenerTodas());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")
    @PutMapping("{id}")
    public ResponseEntity<Clase> actualizar(
            @PathVariable Integer id,
            @RequestBody Clase clase){

        return ResponseEntity.ok(claseService.actualizar(id, clase));
    }

    // Endpoint DELETE para eliminar una clase por su id.
    // Recibe el id desde la URL (@PathVariable).
    // Llama al service para borrar en base de datos.
    // Devuelve HTTP 204 (No Content)
    // El front debe recoger el no content y mostrar un mensaje.
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        claseService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}
