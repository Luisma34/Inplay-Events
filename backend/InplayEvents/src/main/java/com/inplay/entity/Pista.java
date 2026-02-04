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
@Table(name = "pista")
public class Pista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pista")
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Boolean cubierta;

    @Column(nullable = false)
    private Boolean activa;
}
