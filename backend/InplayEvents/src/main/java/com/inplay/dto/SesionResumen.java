package com.inplay.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SesionResumen {

    // ID de la sesión
    private Integer id;

    // Nombre de la clase
    private String nombreClase;

    // Nombre de la pista
    private String nombrePista;

    // Fecha de la sesión en texto
    private String fecha;

    // Hora de inicio en texto
    private String horaInicio;

    // Hora de fin en texto
    private String horaFin;

    // Estado activo/inactivo
    private Boolean activa;
}
