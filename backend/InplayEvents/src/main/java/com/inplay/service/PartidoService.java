package com.inplay.service;

import com.inplay.entity.Partido;
import com.inplay.exception.RecursoNoEncontradoException;
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

    public Partido actualizar(Integer id, Partido nuevo) {

        Partido existente = obtenerPorId(id);

        if (nuevo.getLiga() != null)
            existente.setLiga(nuevo.getLiga());

        if (nuevo.getJornada() != null)
            existente.setJornada(nuevo.getJornada());

        if (nuevo.getFecha() != null)
            existente.setFecha(nuevo.getFecha());

        if (nuevo.getParejaA() != null)
            existente.setParejaA(nuevo.getParejaA());

        if (nuevo.getParejaB() != null)
            existente.setParejaB(nuevo.getParejaB());

        if (nuevo.getEstado() != null)
            existente.setEstado(nuevo.getEstado());

        return partidoRepository.save(existente);
    }


    public Partido obtenerPorId(Integer id) {
        return partidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Partido no encontrado"));
    }

    public void eliminar(Integer id) {
        partidoRepository.deleteById(id);
    }
}
