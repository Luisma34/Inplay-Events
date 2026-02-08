package com.inplay.service;

import com.inplay.entity.Sesion;
import com.inplay.repository.SesionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
// Usamos @RequiredArgsConstructor para inyectar el repositorio a través del constructor.
@RequiredArgsConstructor
public class SesionService {

    private final SesionRepository sesionRepository;

    // Limpieza de sesiones antiguas
    // El metodo se ejecutará automáticamente todos los días a las 3:30 AM, según la expresión cron.
    // Borra sesiones que sean anteriores a 30 días y que no estén activas.
    @Scheduled(cron = "0 30 3 * * ?")
    public void limpiarSesionesAntiguas() {
        LocalDate limite = LocalDate.now().minusDays(30);
        sesionRepository.borrarSesionesAntiguas(limite);
    }

    // Crear sesión
    public Sesion guardarSesion(Sesion sesion) {
        return sesionRepository.save(sesion);
    }

    // Obtener todas
    public List<Sesion> obtenerSesiones() {
        return sesionRepository.findAll();
    }
}

