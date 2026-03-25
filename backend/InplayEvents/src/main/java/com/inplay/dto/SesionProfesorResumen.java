package com.inplay.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SesionProfesorResumen {

    // ID de la sesión
    private Integer id;

    // Nombre de la clase
    private String nombreClase;

    // Nombre del usuario apuntado
    private String nombreUsuario;

    // Email del usuario apuntado
    private String emailUsuario;

    // Nombre de la pista
    private String nombrePista;

    // Fecha
    private String fecha;

    // Hora de inicio
    private String horaInicio;

    // Hora de fin
    private String horaFin;

    // Estado de la sesión
    private Boolean activa;
}
