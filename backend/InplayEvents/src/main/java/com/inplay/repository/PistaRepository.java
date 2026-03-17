package com.inplay.repository;

import com.inplay.entity.Pista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PistaRepository extends JpaRepository<Pista, Integer> {
}
