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
import java.util.List;

@Service
@RequiredArgsConstructor
public class LigaUsuarioService {

    private final LigaUsuarioRepository ligaUsuarioRepository;
    private final LigaRepository ligaRepository;
    private final UsuarioRepository usuarioRepository;

    public void unirse(Integer ligaId, Integer usuarioId) {

        if (ligaUsuarioRepository.existsByLiga_IdAndUsuario_Id(ligaId, usuarioId)) {
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

    public List<Liga> obtenerLigasDeUsuario(Integer usuarioId) {

        return ligaUsuarioRepository
                .findByUsuario_Id(usuarioId)
                .stream()
                .map(LigaUsuario::getLiga)
                .toList();
    }

    public void salir(Integer ligaId, Integer usuarioId) {

        LigaUsuario lu = ligaUsuarioRepository
                .findByLiga_idAndUsuario_Id(ligaId, usuarioId)
                .orElseThrow(() -> new RuntimeException("No estás inscrito en esta liga"));

        ligaUsuarioRepository.delete(lu);
    }
}