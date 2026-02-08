package com.inplay.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuario")
public class Usuario {

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

    //ID del rol (de momento se guarda como número simple)
    // Luego lo convertiremos en relación @ManyToOne
    @Column(name = "id_rol")
    private int idRol;

    //Email único
    @Column(nullable = false, unique = true)
    private String email;

    //Campo booleano
    @Column(nullable = false, name = "activo")
    private Boolean active;

    // Fecha de alta
    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

}
