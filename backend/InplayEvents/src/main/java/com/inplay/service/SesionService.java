package com.inplay.service;

import com.inplay.dto.CrearSesionRequest;
import com.inplay.dto.SesionDisponibilidad;
import com.inplay.dto.SesionProfesorResumen;
import com.inplay.dto.SesionResumen;
import com.inplay.entity.Clase;
import com.inplay.entity.Pista;
import com.inplay.entity.Sesion;
import com.inplay.entity.Usuario;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.ClaseRepository;
import com.inplay.repository.PistaRepository;
import com.inplay.repository.SesionRepository;
import com.inplay.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SesionService {

    private final SesionRepository sesionRepository;
    private final ClaseRepository claseRepository;
    private final PistaRepository pistaRepository;
    private final UsuarioRepository usuarioRepository;

    // Capacidad fija por sesión
    private static final int CAPACIDAD_MAXIMA_POR_SESION = 4;

    // Lista cerrada de horas de inicio permitidas
    // Todas las clases duran 1 hora y 30 minutos
    private static final List<LocalTime> HORAS_PERMITIDAS = List.of(
            LocalTime.of(8, 0),
            LocalTime.of(9, 30),
            LocalTime.of(11, 0),
            LocalTime.of(12, 30),
            LocalTime.of(14, 0),
            LocalTime.of(15, 30),
            LocalTime.of(17, 0),
            LocalTime.of(18, 30),
            LocalTime.of(20, 0),
            LocalTime.of(21, 30)
    );


    // Limpieza automática de sesiones antiguas
    // Se ejecuta todos los días a las 3:30 AM
    // Borra sesiones con más de 30 días y que no estén activas
    @Scheduled(cron = "0 30 3 * * ?")
    public void limpiarSesionesAntiguas() {
        LocalDate limite = LocalDate.now().minusDays(30);
        sesionRepository.borrarSesionesAntiguas(limite);
    }


    // Devuelve todas las sesiones (uso general o admin)
    public List<Sesion> obtenerSesiones() {
        return sesionRepository.findAll();
    }


    // Devuelve SOLO las sesiones del usuario logueado
    // Se usa en "Mi cuenta" → Mis clases
    // Transformamos la entidad a DTO para evitar errores con Hibernate LAZY
    public List<SesionResumen> obtenerSesionesDeUsuario(String emailUsuario) {
        return sesionRepository.findByUsuarioEmail(emailUsuario)
                .stream()
                .map(s -> new SesionResumen(
                        s.getId(),
                        s.getClase().getNombre(),
                        s.getPista().getNombre(),
                        s.getFecha().toString(),
                        s.getHoraInicio().toString(),
                        s.getHoraFin().toString(),
                        s.getActiva()
                ))
                .toList();
    }


    // Devuelve todas las sesiones en formato resumen para el panel del profesor
    public List<SesionProfesorResumen> obtenerSesionesProfesor() {
        return sesionRepository.findAll()
                .stream()
                .map(s -> new SesionProfesorResumen(
                        s.getId(),
                        s.getClase().getNombre(),
                        s.getUsuario().getNombre(),
                        s.getUsuario().getEmail(),
                        s.getPista().getNombre(),
                        s.getFecha().toString(),
                        s.getHoraInicio().toString(),
                        s.getHoraFin().toString(),
                        s.getActiva()
                ))
                .toList();
    }


    // Devuelve la disponibilidad de una sesión concreta
    // definida por clase, fecha y hora de inicio
    // Se usa para mostrar plazas ocupadas, libres y si está completa
    public SesionDisponibilidad obtenerDisponibilidad(Integer idClase, LocalDate fecha, LocalTime horaInicio) {

        // Contar cuántos usuarios hay ya apuntados a esa sesión concreta
        long ocupadas = sesionRepository.countByClaseIdAndFechaAndHoraInicioAndActivaTrue(
                idClase,
                fecha,
                horaInicio
        );

        // Calcular plazas libres
        long libres = CAPACIDAD_MAXIMA_POR_SESION - ocupadas;

        if (libres < 0) {
            libres = 0;
        }

        // Comprobar si está completa
        boolean completa = ocupadas >= CAPACIDAD_MAXIMA_POR_SESION;

        return new SesionDisponibilidad(ocupadas, libres, completa);
    }


    // Crea una nueva sesión (reserva de clase)
    // Reglas:
    // - duración fija de 1h30
    // - solo se permiten horas de inicio concretas
    // - el usuario no puede tener otra clase solapada
    // - máximo 4 personas por sesión concreta
    public Sesion crearSesion(CrearSesionRequest request, String emailUsuario) {

        // Buscar clase
        Clase clase = claseRepository.findById(request.getIdClase())
                .orElseThrow(() -> new RecursoNoEncontradoException("Clase no encontrada"));

        // Buscar pista
        Pista pista = pistaRepository.findById(request.getIdPista())
                .orElseThrow(() -> new RecursoNoEncontradoException("Pista no encontrada"));

        // Buscar usuario logueado por email
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        // Validar fecha
        if (request.getFecha() == null) {
            throw new RuntimeException("La fecha es obligatoria");
        }

        // No permitir reservar clases en fechas pasadas
        if (request.getFecha().isBefore(LocalDate.now())) {
            throw new RuntimeException("No puedes reservar una clase en una fecha pasada");
        }

        // Validar hora de inicio
        if (request.getHoraInicio() == null) {
            throw new RuntimeException("La hora de inicio es obligatoria");
        }

        LocalTime horaInicio = request.getHoraInicio();

        // Comprobar que la hora elegida está en la lista permitida
        if (!HORAS_PERMITIDAS.contains(horaInicio)) {
            throw new RuntimeException("La hora seleccionada no es válida");
        }

        // Calcular hora fin automáticamente
        LocalTime horaFin = horaInicio.plusMinutes(90);

        // Comprobar solape con otras sesiones activas del mismo usuario
        boolean existeSolape = sesionRepository.existeSolapeUsuario(
                emailUsuario,
                request.getFecha(),
                horaInicio,
                horaFin
        );

        if (existeSolape) {
            throw new RuntimeException("Ya tienes otra clase reservada en ese horario");
        }

        // Comprobar cuántos usuarios hay ya apuntados a esta sesión concreta
        long apuntados = sesionRepository.countByClaseIdAndFechaAndHoraInicioAndActivaTrue(
                clase.getId(),
                request.getFecha(),
                horaInicio
        );

        // Comprobar capacidad máxima fija
        if (apuntados >= CAPACIDAD_MAXIMA_POR_SESION) {
            throw new RuntimeException("No quedan plazas disponibles para esta sesión");
        }

        // Crear nueva sesión
        Sesion sesion = new Sesion();
        sesion.setClase(clase);
        sesion.setPista(pista);
        sesion.setUsuario(usuario);
        sesion.setFecha(request.getFecha());
        sesion.setHoraInicio(horaInicio);
        sesion.setHoraFin(horaFin);
        sesion.setActiva(true);

        // Guardar en BD
        return sesionRepository.save(sesion);
    }


    // Cancela una sesión del usuario logueado
    // En vez de borrar físicamente la fila, la marcamos como inactiva
    public void cancelarSesion(Integer idSesion, String emailUsuario) {

        // Buscar la sesión por id y comprobar a la vez que pertenece al usuario logueado
        Sesion sesion = sesionRepository.findByIdAndUsuarioEmail(idSesion, emailUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException("Sesión no encontrada o no te pertenece"));

        // Marcar la sesión como inactiva
        sesion.setActiva(false);

        // Guardar cambios en BD
        sesionRepository.save(sesion);
    }
}