package com.inplay.service;

import com.inplay.entity.Liga;
import com.inplay.entity.LigaUsuario;
import com.inplay.entity.Usuario;
import com.inplay.repository.LigaRepository;
import com.inplay.repository.LigaUsuarioRepository;
import com.inplay.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class LigaUsuarioService {

    private final LigaUsuarioRepository ligaUsuarioRepository;
    private final LigaRepository ligaRepository;
    private final UsuarioRepository usuarioRepository;

    public void unirse(Integer ligaId, Integer usuarioId) {

        if (ligaUsuarioRepository.existsByLiga_IdAndUsuario_Id(usuarioId, ligaId)) {
            throw new IllegalStateException("Ya estás en esta liga");
        }

        Liga liga = ligaRepository.findById(ligaId)
                .orElseThrow(() -> new RuntimeException("Liga no encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        LigaUsuario ligaUsuario = new LigaUsuario();
        ligaUsuario.setLiga(liga);
        ligaUsuario.setUsuario(usuario);
        ligaUsuario.setRol(LigaUsuario.Rol.JUGADOR);
        ligaUsuario.setFechaAlta(LocalDate.now());

        ligaUsuarioRepository.save(ligaUsuario);
    }
}