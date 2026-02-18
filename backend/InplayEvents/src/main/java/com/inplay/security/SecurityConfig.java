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

    //Aqui definimos todas las reglas de seguridad
    // Bean es simplemente un objeto que Spring crea, gestiona y controla por ti dentro de su contenedor.
    @Bean
    public SecurityFilterChain springSecurityFilterChain(HttpSecurity http) throws Exception {

        http
                // Desactivamos CSRF porque trabajamos con React y JSON
                .csrf(csrf -> csrf.disable())

                // Activamos CORS (React corre en otro puerto)
                .cors(Customizer.withDefaults())

                // Aquí solo autenticación general, sin roles.
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/login", "/registro").permitAll()
                        .requestMatchers("/api/auth/registro").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )

                // Activamos login por sesión gestionado automáticamente por Spring
                .formLogin(form -> form
                        // Endpoint que Spring usará para procesar login
                        .loginProcessingUrl("/login")
                        .permitAll()
                )
                // Endpoint para cerrar sesió
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .permitAll()
                );


        return http.build();

    }

    // BCrypt para cifrar contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configuración CORS para permitir React (ej: localhost:3000)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // importante para sesiones.
        // Se sustituirá por el dominio de la aplicación. config.setAllowedOrigins(List.of("https://inplayevents.com"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
