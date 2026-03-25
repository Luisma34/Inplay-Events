package com.inplay.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class CrearSesionRequest {

    // Clase elegida
    private Integer idClase;

    // Pista elegida
    private Integer idPista;

    // Día de la sesión
    private LocalDate fecha;

    // Hora de inicio elegida por el usuario
    private LocalTime horaInicio;
}