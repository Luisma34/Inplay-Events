package com.inplay.service;

import com.inplay.entity.Usuario;
import com.inplay.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    // Inyectamos el repositorio de Usuario para acceder a la base de datos.
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
        return usuarioRepository.findById(id).orElse(null);
    }

    // Metodo para actualizar un usuario existente
    // Este metodo verifica si el usuario existe antes de actualizarlo.
    // Si el usuario no existe, lanza una excepcion.
    public Usuario actualizar(Integer id, Usuario usuario) {
        // Verificamos si el usuario existe antes de actualizarlo
        if (usuarioRepository.existsById(id)) {
            // Aseguramos que el ID se mantenga igual
            // Usa el id de la URL para actualizar el usuario,
            // ignorando cualquier ID que pueda venir en el cuerpo de la solicitud.
            usuario.setId(id);
            return usuarioRepository.save(usuario);
        } else {
            // Si el usuario no existe, lanzamos una excepcion.
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    // Metodo para eliminar un usuario por su ID
    // Este metodo elimina el usuario si existe, o no hace nada si no existe.
    public void eliminar(Integer id) {
        usuarioRepository.deleteById(id);
    }
}
