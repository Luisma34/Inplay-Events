package com.inplay.controller;

import com.inplay.entity.Grupo;
import com.inplay.entity.Noticia;
import com.inplay.service.NoticiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/noticias")
@RequiredArgsConstructor
public class NoticiaController {

    private final NoticiaService noticiaService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Noticia>> obtenerNoticias() {
        return ResponseEntity.ok(noticiaService.obtenerTodas());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PostMapping
    public ResponseEntity<Noticia> crear(@RequestBody Noticia noticia) {
        Noticia creada = noticiaService.guardar(noticia);
        return ResponseEntity.status(201).body(creada);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("{id}")
    public ResponseEntity<Noticia> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(noticiaService.obtenerPorId(id));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PutMapping("{id}")
    public ResponseEntity<Noticia> actualizar(
            @PathVariable Integer id,
            @RequestBody Noticia noticia){

        return ResponseEntity.ok(noticiaService.actualizar(id, noticia));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        noticiaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
