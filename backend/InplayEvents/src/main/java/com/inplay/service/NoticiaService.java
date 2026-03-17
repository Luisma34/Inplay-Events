package com.inplay.service;

import com.inplay.entity.Noticia;
import com.inplay.entity.Usuario;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.NoticiaRepository;
import com.inplay.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticiaService {

    private final NoticiaRepository noticiaRepository;
    private final UsuarioRepository usuarioRepository;

    public Noticia guardar(Noticia noticia) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        noticia.setUsuario(usuario);

        if (noticia.getFechaPublicacion() == null) {
            noticia.setFechaPublicacion(LocalDateTime.now());
        }

        if (noticia.getVisible() == null) {
            noticia.setVisible(true);
        }

        return noticiaRepository.save(noticia);
    }

    public Noticia obtenerPorId(Integer id) {
        return noticiaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Noticia no encontrada"));
    }

    public Noticia actualizar(Integer id, Noticia nueva) {

        Noticia existente = obtenerPorId(id);

        if (nueva.getTitulo() != null)
            existente.setTitulo(nueva.getTitulo());

        if (nueva.getContenido() != null)
            existente.setContenido(nueva.getContenido());

        if (nueva.getFechaPublicacion() != null)
            existente.setFechaPublicacion(nueva.getFechaPublicacion());

        if (nueva.getVisible() != null)
            existente.setVisible(nueva.getVisible());

        if (nueva.getUsuario() != null)
            existente.setUsuario(nueva.getUsuario());

        return noticiaRepository.save(existente);
    }

    // Solo noticias visibles para la parte pública
    public List<Noticia> obtenerTodas() {
        return noticiaRepository.findByVisibleTrue();
    }

    public void eliminar(Integer id) {
        noticiaRepository.deleteById(id);
    }
}