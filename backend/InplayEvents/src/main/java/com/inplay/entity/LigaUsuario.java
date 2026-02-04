package com.inplay.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "liga_usuario")
public class LigaUsuario {

    //Clave primaria compuesta
    @Id
    @Column(name = "id_liga",nullable = false)
    private Integer id;

    @Id
    @Column(name = "id_liga",nullable = false)
    private Integer idLiga;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @Column(name = "fecha_alta", nullable = false)
    private LocalDate fechaAlta;

    //Tipos de rol en la liga
    public enum Rol {
        JUGADOR, CAPITAN, ORGANIZADOR
    }

}
