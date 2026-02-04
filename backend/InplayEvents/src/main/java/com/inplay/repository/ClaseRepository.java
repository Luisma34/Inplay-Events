package com.inplay.repository;

import com.inplay.entity.Clase;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ClaseRepository extends JpaRepository<Clase,Integer> {
}
