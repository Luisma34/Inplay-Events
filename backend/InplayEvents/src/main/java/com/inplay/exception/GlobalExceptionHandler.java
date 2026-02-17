package com.inplay.exception;


import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //Metodo privado que construye un objeto JSON de error estándar
    private Map<String, Object> error(int status, String message) {
        // Creamos un mapa que Spring convertirá automáticamente a JSON. Clave → valor
        Map<String, Object> body = new HashMap<>();
        // Código HTTP del error (404, 400, 500...)
        body.put("status", status);
        // Mensaje legible para el cliente/front
        body.put("message", message);
        // Fecha y hora exacta del error (útil para logs y debugging)
        body.put("timestamp", LocalDateTime.now());
        // Devolvemos el mapa completo como respuesta
        return body;
    }

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

    // JSON mal formado
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> manejarJsonInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(400)
                .body("JSON mal formado o datos inválidos");
    }
    // Error de validacion.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> manejarValidacion(MethodArgumentNotValidException ex) {
        return ResponseEntity.status(400)
                .body("Error de validación en los datos enviados");
    }

    //Escribimos 500 porque es el error estandar de Spring (Internal server error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity handleException(Exception ex) {
        return ResponseEntity.status(500)
                .body("Error interno del servidor " + ex.getMessage());
    }
}
