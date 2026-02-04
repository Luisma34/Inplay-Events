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

    @Column(name = "id_liga", nullable = false)
    private Integer idLiga;

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
