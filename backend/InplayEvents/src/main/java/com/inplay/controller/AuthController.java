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

    private final UsuarioService usuarioService;
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody RegisterRequest request){

        Rol rolUsuario = rolRepository
                .findByRol(Rol.RolUsuario.ROLE_USUARIO)
                .orElseThrow(()->new RuntimeException("Rol no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setName(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(request.getPassword());
        usuario.setRol(rolUsuario);
        usuario.setActive(true);

        return ResponseEntity.status(201).body(usuarioService.guardar(usuario));
    }

    @GetMapping("/me")
    public Usuario usuarioActual(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No autenticado");
        }

        return usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

}
