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
@Table(name = "grupo_usuario")
public class GrupoUsuario {

    //Clave primaria
    @Id
    @Column(name = "id_clasificacion",nullable = false)
    private Integer id;

    @Id
    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    //Tipos de rol en el grupo
    public enum Rol {
        ADMIN,MIEMBRO
    }
}
