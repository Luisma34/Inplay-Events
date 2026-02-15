package com.inplay.controller;

import com.inplay.entity.Pista;
import com.inplay.service.PistaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pistas")
@RequiredArgsConstructor
public class PistaController {

    private final PistaService pistaService;

    @GetMapping
    public ResponseEntity<List<Pista>> getAllPistas() {
        List<Pista> pistas = pistaService.obtenerTodas();
        return ResponseEntity.ok(pistas);
    }

    @PostMapping
    public ResponseEntity<Pista> crear(@RequestBody Pista pista) {
        Pista creada = pistaService.guardar(pista);
        return ResponseEntity.status(201).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pista> actualizar(
            @PathVariable Integer id,
            @RequestBody Pista pista){

        return ResponseEntity.ok(pistaService.actualizar(id, pista));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        pistaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
