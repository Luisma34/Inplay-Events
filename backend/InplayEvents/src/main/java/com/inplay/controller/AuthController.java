package com.inplay.controller;

import com.inplay.dto.RegisterRequest;
import com.inplay.entity.Rol;
import com.inplay.entity.Usuario;
import com.inplay.repository.RolRepository;
import com.inplay.repository.UsuarioRepository;
import com.inplay.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    // Llamada al servicio con la lógica de guardado y el encode password
    private final UsuarioService usuarioService;

    // Acceso a la tabla de roles
    private final RolRepository rolRepository;

    // Acceso a la tabla usuarios
    private final UsuarioRepository usuarioRepository;

    //Endpoint de registro
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody RegisterRequest request) {

        // Busca en base de datos el rol ROLE_USUARIO
        Rol rolUsuario = rolRepository
                .findByRol(Rol.RolUsuario.ROLE_USUARIO)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        // Se crea una nueva instancia de Usuario
        Usuario usuario = new Usuario();

        // Se asignan valores desde el DTO
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());

        // Seteando el password tal cual viene, el enconde password se hace desde el service.
        usuario.setPassword(request.getPassword());

        // Siempre se asigna ROLE_USUARIO
        usuario.setRol(rolUsuario);

        // Se activa por defecto
        usuario.setActive(true);

        // Devuelve el usuario guardadp
        return ResponseEntity.status(201).body(usuarioService.guardar(usuario));
    }

    // Endpoint para saber quién está logueado
    @GetMapping("/me")
    public Usuario usuarioActual(Authentication authentication) {

        // Si no hay sesión válida → error
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No autenticado");
        }

        // authentication.getName() normalmente devuelve el email
        return usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

}
