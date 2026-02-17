package com.inplay.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuario")
public class Usuario implements UserDetails {

    @Id
    // Se genera automáticamente (Auto_increment)
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id_usuario")
    private int id;

    //Columna pasword
    @Column(nullable = false)
    private String password;

    //Nombre obligatorio
    @Column(nullable = false, name = "nombre")
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;


    //Email único
    @Column(nullable = false, unique = true)
    private String email;

    //Campo booleano
    @Column(nullable = false, name = "activo")
    private Boolean active;

    // Fecha de alta
    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    // Metodos de Sring Security
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + rol.getRol().name())
        );
    }

    @Override
    public String getUsername() {
        return email; // Usamos el email como identificador de login
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Puedes añadir lógica real si lo necesitas
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

}
