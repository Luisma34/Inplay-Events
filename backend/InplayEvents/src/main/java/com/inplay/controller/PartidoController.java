package com.inplay.controller;

import com.inplay.entity.Partido;
import com.inplay.service.PartidoService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/partidos")
@RequiredArgsConstructor
public class PartidoController {

    private final PartidoService partidoService;

    @PostMapping
    public ResponseEntity<Partido> crear(@RequestBody Partido partido) {
        return ResponseEntity.ok(partidoService.guardar(partido));
    }

    @GetMapping
    public ResponseEntity<List<Partido>> listar() {
        return ResponseEntity.ok(partidoService.obtenerTodos());
    }

    @PutMapping("{id}")
    public ResponseEntity<Partido> actualizar(
            @PathVariable Integer id,
            @RequestBody Partido partido){

        return ResponseEntity.ok(partidoService.actualizar(id, partido));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        partidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
