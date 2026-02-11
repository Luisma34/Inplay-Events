package com.inplay.service;

import com.inplay.entity.Liga;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.LigaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LigaService {

    private final LigaRepository ligaRepository;

    public Liga guardar(Liga liga) {
        return ligaRepository.save(liga);
    }

    public List<Liga> obtenerTodas() {
        return ligaRepository.findAll();
    }

    public Liga obtenerPorId(Integer id) {
        return ligaRepository.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Liga no encontrada"));
    }

    public void eliminar(Integer id) {
        ligaRepository.deleteById(id);
    }
}
