package com.inplay.controller;

import com.inplay.entity.Grupo;
import com.inplay.service.GrupoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/controller")
@RequiredArgsConstructor
public class GrupoController {

    private final GrupoService grupoService;

    @GetMapping
    public ResponseEntity <List<Grupo>> obtenerTodos(){
        return ResponseEntity.ok(grupoService.obtenerTodos());
    }

    @GetMapping("{id}")
    public ResponseEntity <Grupo> obtenerPorId(Integer id){
        return ResponseEntity.ok(grupoService.obtenerPorId(id));
    }
}
