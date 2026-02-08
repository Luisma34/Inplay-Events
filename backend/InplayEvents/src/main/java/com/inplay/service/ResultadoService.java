package com.inplay.service;

import com.inplay.entity.Resultado;
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

    public void eliminar(Integer id) {
        resultadoRepository.deleteById(id);
    }
}
