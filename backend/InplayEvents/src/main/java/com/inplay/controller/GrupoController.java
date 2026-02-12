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

    @GetMapping
    public ResponseEntity<Grupo> crear(@RequestBody Grupo grupo) {
        return ResponseEntity.ok(grupoService.guardar(grupo));
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
    public ResponseEntity<Grupo> actualizar(@PathVariable Integer id, @RequestBody Grupo grupo) {

        Grupo grupoExistente = grupoService.obtenerPorId(id);

        //Java evalúa lo de dentro del paréntesis antes de ejecutar el set.
        grupoExistente.setNombre(grupo.getNombre());
        grupoExistente.setDescripcion(grupo.getDescripcion());
        grupoExistente.setFechaCreacion(grupo.getFechaCreacion());
        grupoExistente.setNivelGrupo(grupo.getNivelGrupo());

        return ResponseEntity.ok(grupoService.guardar(grupoExistente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        grupoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
