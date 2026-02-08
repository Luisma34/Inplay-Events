package com.inplay.service;

import com.inplay.entity.Clasificacion;
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
}
