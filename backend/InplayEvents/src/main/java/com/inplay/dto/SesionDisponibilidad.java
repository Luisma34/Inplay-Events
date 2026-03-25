package com.inplay.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SesionDisponibilidad {

    // Número de plazas ocupadas
    private long ocupadas;

    // Número de plazas libres
    private long libres;

    // Indica si la sesión está completa
    private boolean completa;
}
