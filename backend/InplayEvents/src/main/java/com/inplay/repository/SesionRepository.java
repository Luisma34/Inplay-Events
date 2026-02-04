package com.inplay.repository;

import com.inplay.entity.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SesionRepository extends JpaRepository<Sesion, Integer> {
}
