package com.inplay.service;

import com.inplay.entity.Usuario;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    // Repositorio para acceder a la base de datos
    private final UsuarioRepository usuarioRepository;

    // Encoder para encriptar contraseñas antes de guardarlas
    private final PasswordEncoder passwordEncoder;

    // Crear usuario.
    public Usuario guardar(Usuario usuario) {

        // Encriptamos la contraseña antes de guardar
        // Recordamos que primero se lee lo del paréntesis y luego lo de fuera.
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        return usuarioRepository.save(usuario);
    }

    //Obtener todos los usuarios.
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

        // Primero buscamos el usuario existente
        Usuario existente = obtenerPorId(id);

        // Si se envía nueva contraseña, la volvemos a encriptar
        if (nuevo.getPassword() != null)
            existente.setPassword(passwordEncoder.encode(nuevo.getPassword()));


        // Solo actualizamos campos que no sean null
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

    // Eliminar usuario.
    public void eliminar(Integer id) {

        // Verificamos que exista antes de eliminar
        obtenerPorId(id);

        //Eliminamos por ID
        usuarioRepository.deleteById(id);
    }

}
