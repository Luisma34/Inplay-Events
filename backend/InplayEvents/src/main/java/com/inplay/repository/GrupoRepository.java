package com.inplay.repository;

import com.inplay.entity.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;

// Los Repository se definen como interfaces vacías porque Spring Data JPA
// genera automáticamente en tiempo de ejecución la implementación CRUD
// (save, findAll, findById, delete, etc.). No es necesario escribir código adicional
// para estas operaciones básicas.
public interface GrupoRepository extends JpaRepository<Grupo, Integer> {
}
