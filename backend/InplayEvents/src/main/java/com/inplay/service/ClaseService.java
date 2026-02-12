package com.inplay.service;

import com.inplay.entity.Clase;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.ClaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaseService {

    private final ClaseRepository claseRepository;

    public Clase guardar(Clase clase) {
        return claseRepository.save(clase);
    }

    public List<Clase> obtenerTodas() {
        return claseRepository.findAll();
    }

    public Clase obtenerPorId(Integer id) {
        return claseRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Clase no encontrada"));
    }


    public void eliminar(Integer id) {
        obtenerPorId(id);
        claseRepository.deleteById(id);
    }
}
