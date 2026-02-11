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
@Table(name = "grupo")
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grupo", nullable = false)
    private Integer id;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    // PrePersist se ejecuta antes de que la entidad sea persistida en la base de datos.
    // Aquí se establece la fecha de creación automáticamente.
    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
    }

    //Indica a JPA que el enum se guarda como texto en la base de datos
    // en lugar de números. Esto evita errores si el orden del enum cambia
    // en el futuro.
    // Resultado en la tabla:
    // * La columna "nivel_grupo" almacenará valores como:
    // * PRINCIPIANTE, INTERMEDIO o AVANZADO.
    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_grupo", nullable = false)
    private NivelGrupo nivelGrupo;

    //Niveles de grupo
    public enum NivelGrupo {
        PRINCIPIANTE, INTERMEDIO, AVANZADO
    }


}
