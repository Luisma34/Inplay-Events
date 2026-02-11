package com.inplay.exception;

import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 - recurso no encontrado
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<String> manejarNoEncontrado(RecursoNoEncontradoException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    // 400 - error de validación
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> manejarBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(400).body(ex.getMessage());
    }

    //Escribimos 500 porque es el error estandar de Spring (Internal server error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity handleException(Exception ex) {
        return ResponseEntity.status(500)
                .body("Error interno del servidor " + ex.getMessage());
    }
}
