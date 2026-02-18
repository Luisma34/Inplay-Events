package com.inplay.controller;

import com.inplay.entity.Clasificacion;
import com.inplay.service.ClasificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clasificaciones")
@RequiredArgsConstructor
public class ClasificacionController {

    private final ClasificacionService clasificacionService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Clasificacion>> obtenerTodas() {
        return ResponseEntity.ok(clasificacionService.obtenerTodas());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<Clasificacion> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(clasificacionService.obtenerporID(id));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PostMapping
    public ResponseEntity<Clasificacion> crear(@RequestBody Clasificacion clasificacion) {
        return ResponseEntity.status(201).body(clasificacionService.guardar(clasificacion));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Clasificacion> actualizar(
            @PathVariable Integer id,
            @RequestBody Clasificacion clasificacion){

        return ResponseEntity.ok(clasificacionService.actualizar(id, clasificacion));
    }



    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        clasificacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }


}
