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

    // Busca una clasificación por su ID
// Lanza excepción si no existe
    public Clasificacion obtenerporID(Integer id) {
        return clasificacionRepository.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Clasificación no encontrada"));
    }

    // Actualiza los datos estadísticos de una clasificación existente
    public Clasificacion actualizar(Integer id, Clasificacion nueva) {

        Clasificacion existente = obtenerporID(id);

        existente.setLiga(nueva.getLiga());
        existente.setEquipo(nueva.getEquipo());
        existente.setPuntos(nueva.getPuntos());
        existente.setPartidosJugados(nueva.getPartidosJugados());
        existente.setPartidosGanados(nueva.getPartidosGanados());
        existente.setPartidosPerdidos(nueva.getPartidosPerdidos());
        existente.setSetsFavor(nueva.getSetsFavor());
        existente.setSetsContra(nueva.getSetsContra());

        return clasificacionRepository.save(existente);
    }

    // Elimina una clasificación por ID
    public void eliminar(Integer id) {
        clasificacionRepository.deleteById(id);
    }

}
