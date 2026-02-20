package com.inplay.service;

import com.inplay.entity.Rol;
import com.inplay.entity.Usuario;
import com.inplay.exception.RecursoNoEncontradoException;
import com.inplay.repository.RolRepository;
import com.inplay.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    // Repositorios para acceder a la base de datos
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

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

    public Usuario cambiarRol(Integer id, Rol.RolUsuario nuevoRol) {

        Usuario existente = obtenerPorId(id);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String rolActual = auth.getAuthorities().iterator().next().getAuthority();

        // Si intenta asignar ADMIN o SUPERADMIN -> solo SUPERADMIN puede hacerlo
        if (nuevoRol == Rol.RolUsuario.ROLE_ADMIN ||
                nuevoRol == Rol.RolUsuario.ROLE_SUPERADMIN) {

            if (!rolActual.equals("ROLE_SUPERADMIN")) {
                throw new RuntimeException("Solo SUPERADMIN puede asignar rol");
            }

            // Si intenta asignar PROFESOR
            else if (nuevoRol == Rol.RolUsuario.ROLE_PROFESOR) {

                if (!(rolActual.equals("ROLE_ADMIN") ||
                        rolActual.equals("ROLE_SUPERADMIN"))) {
                    throw new RuntimeException("No tienes permisos para asignar este rol");
                }
            }


        }
        Rol rol = rolRepository.findByRol(nuevoRol)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado."));

        existente.setRol(rol);

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
