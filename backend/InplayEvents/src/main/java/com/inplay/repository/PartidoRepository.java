package com.inplay.repository;

import com.inplay.entity.Partido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartidoRepository extends JpaRepository<Partido, Integer> {
}
