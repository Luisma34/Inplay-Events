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
@Table(name = "partido")
public class Partido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_partido")
    private Integer id;

    // Relación con Liga (muchos partidos pueden pertenecer a una liga).
    // Usamos FetchType.LAZY para cargar la liga solo cuando sea necesario.
    // La columna "id_liga" es la clave foránea que referencia a la tabla "liga".
    // La anotación @JoinColumn indica que esta entidad tiene una columna llamada "id_liga"
    // que es una clave foránea que referencia a la entidad Liga.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_liga", nullable = false)
    private Liga liga;


    @Column(nullable = false)
    private Integer jornada;

    private LocalDateTime fecha;

    @Column(name = "pareja_a", nullable = false)
    private String parejaA;

    @Column(name = "pareja_b", nullable = false)
    private String parejaB;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    public enum Estado {
        PENDIENTE, JUGADO, CANCELADO
    }
}
