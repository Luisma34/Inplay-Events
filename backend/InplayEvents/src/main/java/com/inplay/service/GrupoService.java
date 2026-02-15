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

    public Grupo actualizar(Integer id, Grupo nuevo) {

        Grupo existente = obtenerPorId(id);

        if (nuevo.getNombre() != null)
            existente.setNombre(nuevo.getNombre());

        if (nuevo.getDescripcion() != null)
            existente.setDescripcion(nuevo.getDescripcion());

        if (nuevo.getFechaCreacion() != null)
            existente.setFechaCreacion(nuevo.getFechaCreacion());

        if (nuevo.getNivelGrupo() != null)
            existente.setNivelGrupo(nuevo.getNivelGrupo());

        return grupoRepository.save(existente);
    }


    public List<Grupo> obtenerTodos() {
        return grupoRepository.findAll();
    }

    public void eliminar(Integer id) {
        grupoRepository.deleteById(id);
    }
}
