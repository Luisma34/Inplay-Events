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

    // Actualización segura:
    // solo modificamos los campos enviados
    // si vienen null, conservamos valores anteriores.
    public Usuario actualizar(Integer id, Usuario nuevo) {

        Usuario existente = obtenerPorId(id);

        if (nuevo.getPassword() != null)
            existente.setPassword(nuevo.getPassword());

        if (nuevo.getName() != null)
            existente.setName(nuevo.getName());

        if (nuevo.getEmail() != null)
            existente.setEmail(nuevo.getEmail());

        if (nuevo.getActive() != null)
            existente.setActive(nuevo.getActive());

        if (nuevo.getFechaAlta() != null)
            existente.setFechaAlta(nuevo.getFechaAlta());

        return usuarioRepository.save(existente);
    }

    public void eliminar(Integer id) {
        obtenerPorId(id);
        usuarioRepository.deleteById(id);
    }

}
