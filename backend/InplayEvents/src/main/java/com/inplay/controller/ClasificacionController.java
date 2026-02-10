package com.inplay.controller;

import com.inplay.entity.Clasificacion;
import com.inplay.service.ClasificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clasificaciones")
@RequiredArgsConstructor
public class ClasificacionController {

    private final ClasificacionService clasificacionService;

    @GetMapping
    public ResponseEntity<Clasificacion> getClasificacion(@RequestParam Integer id) {
        return ResponseEntity.ok(clasificacionService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clasificacion> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(clasificacionService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Clasificacion> crear(@RequestBody Clasificacion clasificacion) {
        return ResponseEntity.ok(clasificacionService.crear(clasificacion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Clasificacion> actualizar(
            @PathVariable Integer id,
            @RequestBody Clasificacion clasificacion) {

        return ResponseEntity.ok(clasificacionService.actualizar(id, clasificacion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        clasificacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }


}
