package com.inplay.service;

import com.inplay.entity.Grupo;
import com.inplay.exception.RecursoNoEncontradoException;
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

    public Grupo obtenerPorId(Integer id) {
        return grupoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Grupo no encontrado"));
    }

    public List<Grupo> obtenerTodos() {
        return grupoRepository.findAll();
    }

    public void eliminar(Integer id) {
        grupoRepository.deleteById(id);
    }
}
