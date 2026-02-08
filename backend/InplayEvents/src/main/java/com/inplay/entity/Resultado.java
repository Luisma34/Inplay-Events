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

    // El metodo prePersist se ejecuta automáticamente antes de que la entidad sea persistida en la base de datos.
    // Aquí se establece la fecha de registro del resultado automáticamente a la fecha y hora actual.
    // Esto garantiza que cada vez que se cree un nuevo resultado,
    // la fecha de registro se establezca correctamente sin necesidad de que el cliente la proporcione.
    @PrePersist
    public void prePersist() {
        this.fechaRegistro = LocalDateTime.now();
    }


}
