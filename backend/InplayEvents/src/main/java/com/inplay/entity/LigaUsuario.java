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
@Table(name = "liga_usuario",
// Un usuario puede estar en varias ligas,
// pero no puede repetirse en la misma liga.
        uniqueConstraints =
        @UniqueConstraint(columnNames = {"id_usuario", "id_liga"}))
public class LigaUsuario {

    //Clave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    // Clave foránea a Liga
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_liga", nullable = false)
    private Liga liga;

    // Clave foránea a Usuario
    // Un usuario puede estar en varias ligas, pero no puede repetirse en la misma liga.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @Column(name = "fecha_alta", nullable = false)
    private LocalDate fechaAlta;

    // PrePersist se ejecuta antes de que la entidad sea persistida en la base de datos.
    // Aquí se establece la fecha de alta automáticamente.
    @PrePersist
    public void prePersist() {
        this.fechaAlta = LocalDate.now();
    }


    //Tipos de rol en la liga
    public enum Rol {
        JUGADOR, CAPITAN, ORGANIZADOR
    }

}
