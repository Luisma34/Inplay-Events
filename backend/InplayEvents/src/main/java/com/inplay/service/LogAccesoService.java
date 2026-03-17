package com.inplay.service;

import com.inplay.entity.LogAcceso;
import com.inplay.repository.LogAccesoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogAccesoService {

    private final LogAccesoRepository logRepository;

    public LogAcceso guardar(LogAcceso log) {
        return logRepository.save(log);
    }

    public List<LogAcceso> obtenerTodos() {
        return logRepository.findAll();
    }

    // Tarea automática
    @Scheduled(cron = "0 0 3 * * ?")
    public void limpiarLogsAntiguos() {
        LocalDateTime limite = LocalDateTime.now().minusDays(30);
        logRepository.borrarAntiguos(limite);
    }
}
