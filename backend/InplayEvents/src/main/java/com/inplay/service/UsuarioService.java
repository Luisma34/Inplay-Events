package com.inplay.service;

import com.inplay.entity.Usuario;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // Metodo para obtener un usuario por su ID
    // Este metodo devuelve el usuario si se encuentra, o null si no existe.
    public Usuario obtenerPorId(Integer id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }

    public Usuario actualizar(Integer id, Usuario usuario) {
        Usuario existente = obtenerPorId(id);
        usuario.setId(existente.getId());
        return usuarioRepository.save(usuario);
    }

    public void eliminar(Integer id) {
        obtenerPorId(id);
        usuarioRepository.deleteById(id);
    }

}
