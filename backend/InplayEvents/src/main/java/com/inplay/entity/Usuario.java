package com.inplay.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "usuario")
public class Usuario implements UserDetails {

    @Id
    // Se genera automáticamente (Auto_increment)
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id_usuario")
    private Integer id;

    //Columna pasword
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    //Nombre obligatorio
    @Column(nullable = false, name = "nombre")
    private String nombre;

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
    // Devuelve los roles del usuario.
    // Spring exige que empiecen por "ROLE_".
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // El enum ya es ROLE_ADMIN, ROLE_USUARIO...
        return List.of(new SimpleGrantedAuthority(rol.getRol().name()));
    }


    // Devuelve el identificador del usuario.
    // En este proyecto usamos el email como username.
    @Override
    public String getUsername() {
        return email; // Usamos el email como identificador de login
    }

    //Indica si la cuenta ha expirado
    // Aqui devolvemos true (no expira).
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // Indica si la cuenta está bloqueada
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // Indica si la contraseña ha expirado
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // Indica si el usuario está activo.
    // Aqui si usamos el campo real de la DB.
    @Override
    public boolean isEnabled() {
        return active;
    }

}
