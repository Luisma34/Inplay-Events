package com.inplay.dto;

public record UsuarioPerfilDTO(

        // Crea los atributos automáticamente, constructor, getters, equals, hashCode y toString.
        String nombre,
        String email,
        String telefono
) {
}
