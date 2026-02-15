package com.inplay.controller;

import com.inplay.entity.Resultado;
import com.inplay.service.ResultadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resultados")
@RequiredArgsConstructor
public class ResultadoController {

    private final ResultadoService resultadoService;

    @PostMapping
    public ResponseEntity<Resultado> crear(@RequestBody Resultado resultado) {
        return ResponseEntity.status(201).body(resultadoService.guardar(resultado));
    }

    @GetMapping
    public ResponseEntity<List<Resultado>> obtenerTodos() {
        return ResponseEntity.ok(resultadoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resultado> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(resultadoService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resultado> actualizar(
            @PathVariable Integer id,
            @RequestBody Resultado nuevo) {

        return ResponseEntity.ok(resultadoService.actualizar(id, nuevo));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        resultadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
