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

    public Clasificacion actualizar(Integer id, Clasificacion nueva){

        // Buscamos la clasificación existente en base de datos.
        // Si no existe, se lanza excepción 404.
        Clasificacion existente = obtenerporID(id);

        // Actualizamos cada campo solo si viene informado.
        if (nueva.getLiga() != null)
            existente.setLiga(nueva.getLiga());

        if (nueva.getEquipo() != null)
            existente.setEquipo(nueva.getEquipo());

        if (nueva.getPuntos() != null)
            existente.setPuntos(nueva.getPuntos());

        if (nueva.getPartidosJugados() != null)
            existente.setPartidosJugados(nueva.getPartidosJugados());

        if (nueva.getPartidosGanados() != null)
            existente.setPartidosGanados(nueva.getPartidosGanados());

        if (nueva.getPartidosPerdidos() != null)
            existente.setPartidosPerdidos(nueva.getPartidosPerdidos());

        if (nueva.getSetsFavor() != null)
            existente.setSetsFavor(nueva.getSetsFavor());

        if (nueva.getSetsContra() != null)
            existente.setSetsContra(nueva.getSetsContra());

        // Guardamos la entidad ya actualizada en la base de datos
        // y devolvemos la versión persistida.
        return clasificacionRepository.save(existente);
    }


    public void eliminar(Integer id) {
        obtenerporID(id);
        clasificacionRepository.deleteById(id);
    }

}
