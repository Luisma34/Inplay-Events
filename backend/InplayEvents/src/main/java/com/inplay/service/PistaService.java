package com.inplay.service;

import com.inplay.entity.Pista;
import com.inplay.exception.RecursoNoEncontradoException;
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

    public Pista obtenerPorId(Integer id) {
        return pistaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Pista no encontrada"));
    }

    public Pista actualizar(Integer id, Pista nueva) {

        Pista existente = obtenerPorId(id);

        if (nueva.getNombre() != null)
            existente.setNombre(nueva.getNombre());

        if (nueva.getCubierta() != null)
            existente.setCubierta(nueva.getCubierta());

        if (nueva.getActiva() != null)
            existente.setActiva(nueva.getActiva());

        return pistaRepository.save(existente);
    }


    public void eliminar(Integer id) {
        obtenerPorId(id); // fuerza 404 si no existe
        pistaRepository.deleteById(id);
    }
}
