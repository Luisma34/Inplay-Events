package com.inplay.controller;

import com.inplay.entity.Grupo;
import com.inplay.repository.GrupoRepository;
import com.inplay.service.GrupoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
@RequiredArgsConstructor
public class GrupoController {

    private final GrupoService grupoService;

    @PostMapping
    public ResponseEntity<Grupo> crear(@RequestBody Grupo grupo) {
        return ResponseEntity.status(201).body(grupoService.guardar(grupo));
    }

    @GetMapping("{id}")
    public ResponseEntity<Grupo> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(grupoService.obtenerPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Grupo>> obtenerTodos() {
        return ResponseEntity.ok(grupoService.obtenerTodos());
    }

    @PutMapping("{id}")
    public ResponseEntity<Grupo> actualizar(
            @PathVariable Integer id,
            @RequestBody Grupo grupo){

        return ResponseEntity.ok(grupoService.actualizar(id, grupo));
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        grupoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
