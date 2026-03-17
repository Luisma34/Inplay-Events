package com.inplay.controller;

import com.inplay.entity.Grupo;
import com.inplay.repository.GrupoRepository;
import com.inplay.service.GrupoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
@RequiredArgsConstructor
public class GrupoController {

    private final GrupoService grupoService;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")
    @PostMapping
    public ResponseEntity<Grupo> crear(@RequestBody Grupo grupo) {
        return ResponseEntity.status(201).body(grupoService.guardar(grupo));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("{id}")
    public ResponseEntity<Grupo> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(grupoService.obtenerPorId(id));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Grupo>> obtenerTodos() {
        return ResponseEntity.ok(grupoService.obtenerTodos());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")
    @PutMapping("{id}")
    public ResponseEntity<Grupo> actualizar(
            @PathVariable Integer id,
            @RequestBody Grupo grupo){

        return ResponseEntity.ok(grupoService.actualizar(id, grupo));
    }


    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_PROFESOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        grupoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
