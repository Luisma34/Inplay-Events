package com.inplay.controller;

import com.inplay.entity.Resultado;
import com.inplay.service.ResultadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resultados")
@RequiredArgsConstructor
public class ResultadoController {

    private final ResultadoService resultadoService;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")

    @PostMapping
    public ResponseEntity<Resultado> crear(@RequestBody Resultado resultado) {
        return ResponseEntity.status(201).body(resultadoService.guardar(resultado));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Resultado>> obtenerTodos() {
        return ResponseEntity.ok(resultadoService.obtenerTodos());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<Resultado> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(resultadoService.obtenerPorId(id));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Resultado> actualizar(
            @PathVariable Integer id,
            @RequestBody Resultado nuevo) {

        return ResponseEntity.ok(resultadoService.actualizar(id, nuevo));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        resultadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
