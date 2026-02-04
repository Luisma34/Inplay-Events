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
@Table(name = "clasificacion",
// Define una restricción de unicidad para la combinación de id_liga y equipo
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"id_liga", "equipo"}
        ))
public class Clasificacion {

    //Clave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_clasificacion")
    private Integer id;

    // Relación ManyToOne con Liga
    // Cada Clasificacion pertenece a una sola Liga pero una Liga puede tener muchas Clasificaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_liga", nullable = false)
    private Integer idLiga;

    @Column(nullable = false, name = "equipo")
    private String equipo;

    @Column(nullable = false, name = "puntos")
    private Integer puntos;

    @Column(name = "partidos_jugados")
    private Integer partidosJugados;

    @Column(name = "partidos_ganados")
    private Integer partidosGanados;

    @Column(name = "partidos_perdidos")
    private Integer partidosPerdidos;

    @Column(name = "sets_favor")
    private Integer setsFavor;

    @Column(name = "sets_contra")
    private Integer setsContra;


}
