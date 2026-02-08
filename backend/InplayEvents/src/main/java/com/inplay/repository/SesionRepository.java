package com.inplay.repository;

import com.inplay.entity.Sesion;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Integer> {

    // Metodo personalizado para eliminar sesiones antiguas
    // Se marca como @Modifying porque es una consulta de eliminación
    // Se marca como @Transactional para que la operación de eliminación se ejecute
    // dentro de una transacción.
    // Transactional asegura que si algo sale mal durante la eliminación, los cambios se revertirán automáticamente.
    @Modifying
    @Transactional
    // La consulta JPQL para eliminar sesiones cuya fecha es anterior a un límite dado
    // :limite es un parámetro que se pasara al metodo para especificar la fecha límite.
    @Query(value = "DELETE FROM Sesion sesion WHERE sesion.fecha < :limite AND sesion.activa = false")
    void borrarSesionesAntiguas(@Param("limite") LocalDate limite);

}
