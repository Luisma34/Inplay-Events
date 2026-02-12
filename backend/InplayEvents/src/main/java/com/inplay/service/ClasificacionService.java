package com.inplay.service;

import com.inplay.entity.Clasificacion;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.ClasificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClasificacionService {

    private final ClasificacionRepository clasificacionRepository;

    public Clasificacion guardar(Clasificacion clasificacion) {
        return clasificacionRepository.save(clasificacion);
    }

    public List<Clasificacion> obtenerTodas() {
        return clasificacionRepository.findAll();
    }

    public Clasificacion obtenerporID(Integer id) {
        return clasificacionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Clasificación no encontrada"));
    }

    public Clasificacion actualizar(Integer id, Clasificacion clasificacion) {
        Clasificacion existente = obtenerporID(id);
        clasificacion.setId(existente.getId());
        return clasificacionRepository.save(clasificacion);
    }

    public void eliminar(Integer id) {
        clasificacionRepository.deleteById(id);
    }
}
