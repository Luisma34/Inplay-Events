package com.inplay.service;

import com.inplay.entity.Clase;
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

    public void eliminar(Integer id) {
        claseRepository.deleteById(id);
    }
}
