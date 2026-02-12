package com.inplay.controller;

import com.inplay.entity.Grupo;
import com.inplay.entity.Noticia;
import com.inplay.service.NoticiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/noticias")
@RequiredArgsConstructor
public class NoticiaController {

    private final NoticiaService noticiaService;


    @PostMapping
    public ResponseEntity <List<Noticia>> obtenerNoticias(){
        return ResponseEntity.ok(noticiaService.obtenerTodas());
    }

    @GetMapping
    public ResponseEntity<Noticia> crear(@RequestBody Noticia noticia) {
        return ResponseEntity.ok(noticiaService.guardar(noticia));
    }

    @GetMapping("{id}")
    public ResponseEntity<Noticia> obtenerPorId(@PathVariable Integer id){
        return ResponseEntity.ok(noticiaService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Noticia> actualizar(@PathVariable Integer id,
                                              @RequestBody Noticia noticia) {

        Noticia existente = noticiaService.obtenerPorId(id);

        existente.setTitulo(noticia.getTitulo());
        existente.setContenido(noticia.getContenido());
        existente.setFechaPublicacion(noticia.getFechaPublicacion());
        existente.setVisible(noticia.getVisible());
        existente.setUsuario(noticia.getUsuario());

        return ResponseEntity.ok(noticiaService.guardar(existente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        noticiaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
