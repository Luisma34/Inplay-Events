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

    @Column(name = "id_partido", nullable = false, unique = true)
    private Integer idPartido;

    @Column(name = "sets_pareja_a", nullable = false)
    private Integer setsParejaA;

    @Column(name = "sets_pareja_b", nullable = false)
    private Integer setsParejaB;

    //Guarda la fecha y hora en que se registró el resultado
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

}
