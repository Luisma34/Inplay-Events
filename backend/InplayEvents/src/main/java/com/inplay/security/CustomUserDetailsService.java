package com.inplay.security;

import com.inplay.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// Marca esta clase como componente de Spring (se inyecta automáticamente).
@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    // Repositorio para acceder a la tabla usuario en base de datos
    private final UsuarioRepository usuarioRepository;

    // Metodo que Spring Security ejecuta automáticamente al hacer login
    @Override
    public UserDetails loadUserByUsername (String email) throws UsernameNotFoundException{

        // Busca el usuario por email en la base de datos
        return usuarioRepository.findByEmail(email)
                // Si no existe, lanza excepción y el login falla
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado."));
    }




}
