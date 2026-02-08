package com.inplay.service;

import com.inplay.entity.Partido;
import com.inplay.repository.PartidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PartidoService {

    private final PartidoRepository partidoRepository;

    public Partido guardar(Partido partido) {
        return partidoRepository.save(partido);
    }

    public List<Partido> obtenerTodos() {
        return partidoRepository.findAll();
    }

    public Partido obtenerPorId(Integer id) {
        return partidoRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        partidoRepository.deleteById(id);
    }
}
