package com.inplay.service;

import com.inplay.entity.Reserva;
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
        return resultadoRepository.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Resultado no encontrada"));
    }

    public void eliminar(Integer id) {
        resultadoRepository.deleteById(id);
    }
}
