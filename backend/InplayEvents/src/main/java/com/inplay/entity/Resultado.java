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
@Table(name = "resultado")
public class Resultado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado")
    private Integer id;

    // Relación uno a uno con Partido, cada resultado corresponde a un partido específico.
    // Se utiliza FetchType.LAZY para cargar el partido solo cuando se accede al resultado, optimizando el rendimiento.
    // La columna "id_partido" en la tabla "resultado" es una clave foránea que referencia a la tabla "partido".
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_partido", nullable = false, unique = true)
    private Partido partido;


    @Column(name = "sets_pareja_a", nullable = false)
    private Integer setsParejaA;

    @Column(name = "sets_pareja_b", nullable = false)
    private Integer setsParejaB;

    //Guarda la fecha y hora en que se registró el resultado
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

}
