package com.inplay.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    // Contraseña actual (para validación)
    @NotBlank
    private String passwordActual;

    // Nueva contraseña
    @NotBlank
    private String nuevaPassword;
}
