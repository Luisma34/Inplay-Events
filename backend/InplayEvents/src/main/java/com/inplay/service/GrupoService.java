package com.inplay.service;

import com.inplay.entity.Grupo;
import com.inplay.repository.GrupoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrupoService {

    private final GrupoRepository grupoRepository;

    public Grupo guardar(Grupo grupo) {
        return grupoRepository.save(grupo);
    }

    public List<Grupo> obtenerTodos() {
        return grupoRepository.findAll();
    }
}
