package com.inplay.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.List;

// Marca esta clase como una clase de configuración de Spring.
// Significa que aquí se definen ajustes globales de la aplicación:
// beans, seguridad, filtros, dependencias o comportamientos del sistema.
// Spring la lee al arrancar y aplica automáticamente lo que se configure dentro.
@Configuration
// Activa @PreAuthorize en metodos
@EnableMethodSecurity
public class SecurityConfig {

    // Bean principal donde se definen todas las reglas de seguridad HTTP.
    // Bean es simplemente un objeto que Spring crea, gestiona y controla por ti dentro de su contenedor.
    @Bean
    public SecurityFilterChain springSecurityFilterChain(HttpSecurity http) throws Exception {

        http
                // Desactiva CSRF porque usamos API REST con React (no formularios tradicionales).
                .csrf(csrf -> csrf.disable())

                // Activa CORS para permitir peticiones desde otro dominio/puerto (React).
                .cors(Customizer.withDefaults())

                // Define las reglas de autorización por rutas.
                .authorizeHttpRequests(auth -> auth
                        // Permite acceso sin autenticación al login y registro.
                        .requestMatchers(HttpMethod.POST, "/login", "/registro").permitAll()

                        // Permite registro desde endpoint específico.
                        .requestMatchers("/api/auth/registro").permitAll()

                        // Cualquier ruta que empiece por /api/ requiere usuario autenticado.
                        .requestMatchers("/api/**").authenticated()

                        // El resto de rutas son públicas.
                        .anyRequest().permitAll()
                )

                // Activamos login por sesión gestionado automáticamente por Spring
                .formLogin(form -> form

                        // URL que Spring intercepta para procesar autenticación.
                        .loginProcessingUrl("/login")
                        // Permite que cualquiera pueda acceder al login.
                        .permitAll()
                )

                // Endpoint para cerrar sesión
                .logout(logout -> logout
                        .logoutUrl("/logout")

                        // Permite que cualquier usuario autenticado pueda cerrar sesión.
                        .permitAll()
                );


        return http.build();

    }

    // Bean que define el algoritmo de cifrado de contraseñas.
    // BCrypt es el estándar recomendado por Spring Security.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configuración CORS personalizada.
    // Permite que el frontend (React) pueda hacer peticiones al backend.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Dominios permitidos para hacer peticiones al backend.
        config.setAllowedOrigins(List.of("http://localhost:3000"));

        // Métodos HTTP permitidos.
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));

        // Cabeceras permitidas en la petición.
        config.setAllowedHeaders(List.of("*"));

        // Permite enviar cookies/sesión en las peticiones (necesario si usas login por sesión).
        config.setAllowCredentials(true); // importante para sesiones.

        // Aquí deberás sustituir por el dominio real en producción.
        // config.setAllowedOrigins(List.of("https://inplayevents.com"));

        // Registra la configuración CORS para todas las rutas.
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
