package com.inplay.service;

import com.inplay.entity.Resultado;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.ResultadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultadoService {

    private final ResultadoRepository resultadoRepository;

    public Resultado guardar(Resultado resultado) {
        return resultadoRepository.save(resultado);
    }

    public List<Resultado> obtenerTodos() {
        return resultadoRepository.findAll();
    }

    public Resultado obtenerPorId(Integer id) {
        return resultadoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Resultado no encontrado"));
    }

    // Actualiza un resultado de forma segura.
    // Solo se modifican los campos que el cliente envía.
    // Si un campo viene null, se conserva el valor anterior.
    // Evita borrar datos accidentalmente.
    public Resultado actualizar(Integer id, Resultado nuevo) {

        // Buscamos el resultado existente.
        // Si no existe, lanzamos 404.
        Resultado existente = obtenerPorId(id);

        // Actualizamos solo campos informados.

        if (nuevo.getPartido() != null)
            existente.setPartido(nuevo.getPartido());

        if (nuevo.getSetsParejaA() != null)
            existente.setSetsParejaA(nuevo.getSetsParejaA());

        if (nuevo.getSetsParejaB() != null)
            existente.setSetsParejaB(nuevo.getSetsParejaB());

        if (nuevo.getFechaRegistro() != null)
            existente.setFechaRegistro(nuevo.getFechaRegistro());

        // Guardamos y devolvemos el resultado actualizado
        return resultadoRepository.save(existente);
    }


    public void eliminar(Integer id) {
        obtenerPorId(id);
        resultadoRepository.deleteById(id);
    }
}
