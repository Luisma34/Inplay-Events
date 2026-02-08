package com.inplay.repository;

import com.inplay.entity.LogAcceso;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDateTime;

@Repository
public interface LogAccesoRepository extends JpaRepository<LogAcceso, Integer> {

    @Modifying
    @Transactional
    @Query("DELETE FROM LogAcceso log WHERE log.fecha < :limite")
    void borrarAntiguos(@Param("limite") LocalDateTime limite);

}
