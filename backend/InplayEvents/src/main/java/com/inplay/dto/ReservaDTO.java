package com.inplay.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaDTO(
        Integer id,
        LocalDate fecha,
        LocalTime hora,
        String estado,
        Integer pistaId,
        String pistaNombre
) {
}
