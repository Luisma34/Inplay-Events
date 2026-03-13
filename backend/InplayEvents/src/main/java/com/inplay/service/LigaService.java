package com.inplay.service;

import com.inplay.entity.Liga;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.LigaRepository;
import com.inplay.repository.LigaUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LigaService {

    private final LigaRepository ligaRepository;
    private final LigaUsuarioRepository ligaUsuarioRepository;

    public Liga guardar(Liga liga) {
        return ligaRepository.save(liga);
    }

    public List<Liga> obtenerTodas() {
        return ligaRepository.findAll();
    }

    public Liga obtenerPorId(Integer id) {
        Liga liga = ligaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Liga no encontrada"));

        int inscritos = (int) ligaUsuarioRepository.countByLigaId(id);

        liga.setInscritos(inscritos);

        return liga;
    }

    public Liga actualizar(Integer id, Liga liga) {
        Liga existente = obtenerPorId(id);
        liga.setId(existente.getId());
        return ligaRepository.save(liga);
    }

    public void eliminar(Integer id) {
        ligaRepository.deleteById(id);
    }
}
