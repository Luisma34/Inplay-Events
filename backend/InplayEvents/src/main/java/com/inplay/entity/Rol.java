package com.inplay.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rol")
public class Rol {

    //Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol", nullable = false)
    @Id
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private RolUsuario rol;

    //Tipos de rol en el grupo
    public enum RolUsuario {
        ROLE_SUPERADMIN,
        ROLE_ADMIN,
        ROLE_USUARIO,
        ROLE_PROFESOR
    }


}
