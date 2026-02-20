package com.inplay.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    // Contraseña actual (para validación)
    private String passwordActual;

    // Nueva contraseña
    private String nuevaPassword;
}
