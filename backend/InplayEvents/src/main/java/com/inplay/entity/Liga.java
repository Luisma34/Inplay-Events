package com.inplay.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "liga", uniqueConstraints =
        @UniqueConstraint(columnNames = {"nombre", "categoria", "division"}))
public class Liga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_liga")
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private String division;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    // PrePersist se ejecuta antes de que la entidad sea persistida en la base de datos.
    // Aquí se establece la fecha de creación automáticamente.
    // Esto garantiza que cada vez que se cree una nueva Liga,
    // la fecha de creación se registre correctamente sin necesidad de que el cliente la proporcione.
    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
    }

    //Estados posibles de la liga
    public enum Estado {
        ABIERTA, EN_CURSO, FINALIZADA, CANCELADA
    }
}
