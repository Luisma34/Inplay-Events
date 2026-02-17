package com.inplay.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String token;
    // No hay setter a propósito (inmutabilidad práctica del DTO de respuesta)
}
