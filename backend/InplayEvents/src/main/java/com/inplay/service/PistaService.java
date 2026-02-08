package com.inplay.service;

import com.inplay.entity.Pista;
import com.inplay.repository.PistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PistaService {

    private final PistaRepository pistaRepository;

    public Pista guardar(Pista pista) {
        return pistaRepository.save(pista);
    }

    public List<Pista> obtenerTodas() {
        return pistaRepository.findAll();
    }

    public void eliminar(Integer id) {
        pistaRepository.deleteById(id);
    }
}
