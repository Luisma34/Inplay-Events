package com.inplay.controller;

import com.inplay.entity.Grupo;
import com.inplay.service.GrupoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/controller")
@RequiredArgsConstructor
public class GrupoController {

    private final GrupoService grupoService;

    @GetMapping
    public ResponseEntity<List<Grupo>> obtenerTodos() {
        return ResponseEntity.ok(grupoService.obtenerTodos());
    }

    @GetMapping("{id}")
    public ResponseEntity<Grupo> obtenerPorId(Integer id) {
        return ResponseEntity.ok(grupoService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Grupo> crear(@RequestBody Grupo grupo) {
        Grupo creado = grupoService.guardar(grupo);
        return ResponseEntity.ok(creado);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        grupoService.eliminar(id);
        //  DELETE exitoso → devuelve HTTP 204.
        //  No envía datos.
        // *El frontend debe mostrar el mensaje al usuario.
        return ResponseEntity.noContent().build();
    }


}
