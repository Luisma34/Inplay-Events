package com.inplay.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sesion")
public class Sesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sesion")
    private Integer id;

    @Column(name = "id_clase", nullable = false)
    private Integer idClase;

    @Column(name = "id_pista", nullable = false)
    private Integer idPista;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    // Guarda SOLO fecha (año, mes, día)
    @Column(nullable = false)
    private LocalDate fecha;

    // Guarda SOLO hora (hora, minutos, segundos)
    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Column(nullable = false)
    private Boolean activa;
}
