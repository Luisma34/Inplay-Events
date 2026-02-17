package com.inplay.security;

import com.inplay.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

// Le dice a Spring: crea una instancia automática de esta clase
@Service
public class JwtService {

    // Inyecta el valor jwt.secret desde application.properties
    // Esta será tu clave criptográfica en Base64
    @Value("${jwt.secret}")
    private String secret;

    // Inyecta el tiempo de expiración en milisegundos
    @Value("${jwt.expiration}")
    private long expiration;

    // Reconstruye la clave real (SecretKey) a partir del texto Base64
    private SecretKey getKey() {

        // 1. Decodifica el texto Base64 → bytes originales
        // 2. Construye una SecretKey válida para firmar JWT (HS256)
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
    }

    // Genera el token
    // Crea el JWT a partir de un Usuario autenticado
    public String generateToken(Usuario usuario) {

        return Jwts.builder()
                // Identidad principal del token (equivale al "username")
                .setSubject(usuario.getEmail())
                // Añadimos información extra dentro del token (claims personalizados)
                // Aquí guardamos el rol del usuario
                .claim("rol", usuario.getRol().getRol().name())
                // Fecha en la que se genera el token
                .setIssuedAt(new Date())
                // Fecha de expiración (ahora + tiempo configurado)
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                // Firma digital del token usando la clave segura
                // Si alguien modifica el token, la firma dejará de ser válida
                .signWith(getKey())
                // Compacta el string final JWT
                .compact();
    }

    // Extrae el email (subject)
    // Método genérico que permite extraer cualquier dato del token
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extrae cualquier claim.
    // Los claim son datos dentro del token.
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        // Verifica la firma del token con la clave
        // Si la firma es válida, extrae los claims
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(getKey()) // Verifica firma
                .build()
                .parseClaimsJws(token) // Parsea el JWT
                .getBody(); // Obtiene el contenido

        // Aplica la función que le pasamos (por ejemplo getSubject o getExpiration)
        return resolver.apply(claims);
    }

    // Verifica si el token es válido
    // Comprueba si el token pertenece al usuario y no está expirado
    public boolean validateToken(String token, Usuario usuario) {
        // Extrae el email del token
        final String username = extractUserName(token);
        // Devuelve true si:
        // El email coincide
        // El token no ha expirado
        return (username.equals(usuario.getEmail()) && !isTokenExpired(token));
    }

    // Comprueba si la fecha de expiración ya pasó
    private boolean isTokenExpired(String token) {

        // Extrae la fecha de expiración
        Date expirationDate = extractClaim(token, Claims::getExpiration);
        // Si la fecha del token es anterior a ahora → está expirado
        return expirationDate.before(new Date());
    }

}
