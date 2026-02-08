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
// @Entity = tabla en la base de datos
@Entity
@Table(name = "clase")
public class Clase {

    //Clave primaria
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_clase")
    private Integer id;

    //Nombre de la clase
    @Column(nullable = false, name = "nombre")
    private String nombre;

    // ENUM en DB -> String en Java
    // Hibernate lo guarda como texto
    @Column(nullable = false, name = "nivel")
    private String nivel;

    // Capacidad máxima de la clase
    @Column(nullable = false, name = "capacidad")
    private Integer capacidad;

    //TINYINT(1) -> Boolean
    @Column(nullable = false, name = "activa")
    private Boolean activa;

}
