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
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Integer id;

    // Relación con Usuario y Pista usando @ManyToOne
    // La reserva está asociada a un usuario y a una pista,
    // por lo que usamos @ManyToOne para establecer la relación.
    // FetchType.LAZY para cargar la información del usuario y la pista solo cuando sea necesario.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pista", nullable = false)
    private Pista pista;


    // Guarda SOLO fecha (año, mes, día)
    @Column(nullable = false)
    private LocalDate fecha;

    // Guarda SOLO hora (hora, minutos, segundos)
    @Column(nullable = false)
    private LocalTime hora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado;

    public enum Estado {
        ACTIVA, CANCELADA, COMPLETADA
    }
}
