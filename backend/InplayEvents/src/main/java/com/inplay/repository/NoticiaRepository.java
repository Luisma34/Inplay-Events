package com.inplay.repository;

import com.inplay.entity.Noticia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticiaRepository extends JpaRepository<Noticia, Integer> {
}
