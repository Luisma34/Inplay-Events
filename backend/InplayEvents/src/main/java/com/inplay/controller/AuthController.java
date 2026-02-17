package com.inplay.controller;

import com.inplay.dto.LoginRequest;
import com.inplay.dto.LoginResponse;
import com.inplay.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
// Indica que esta clase es un controlador REST: devuelve JSON (no vistas)
@RequestMapping("/auth")
// Prefijo de ruta: todo lo de este controller empieza por /auth
@RequiredArgsConstructor
// Lombok: crea un constructor con los campos "final" (inyección por constructor)
public class AuthController {

    // AuthenticationManager es el "motor" de Spring Security para autenticar credenciales
    private final AuthenticationManager authenticationManager;

    // Servicio que tú ya tienes: genera/valida tokens JWT
    private final JwtService jwtService;

    @PostMapping("/login")
    // Endpoint POST /auth/login
    // Recibe un JSON y responde con JSON (LoginResponse)
    public LoginResponse login(@RequestBody LoginRequest request) {
        // @RequestBody: Spring convierte el JSON del body en un objeto LoginRequest

        // 1) Creamos un "token de autenticación" con email + password
        //    OJO: esto NO es el JWT; es un objeto que Spring usa internamente para validar credenciales
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),     // "username" (en tu caso, email)
                        request.getPassword()   // password en texto plano (la que manda el usuario)
                )
        );

        // 2) Si authenticate() NO lanza excepción, significa que las credenciales son correctas.
        //    authentication contiene el usuario autenticado (principal) y sus roles (authorities).

        // 3) Recuperamos el usuario autenticado.
        //    Esto funciona si tu sistema devuelve como principal un Usuario (o un UserDetails compatible).
        Usuario usuario = (Usuario) authentication.getPrincipal();

        // 4) Generamos el JWT con datos del usuario (subject/email + roles + expiración...)
        String token = jwtService.generateToken(usuario);

        // 5) Devolvemos el token en un JSON: { "token": "..." }
        return new LoginResponse(token);
    }
}
