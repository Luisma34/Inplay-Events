package com.inplay.service;

import com.inplay.dto.ChangePasswordRequest;
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
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));


        // Seteamos valores obligatorios
        usuario.setFechaAlta(java.time.LocalDateTime.now());
        usuario.setActive(true);

        // Si viene rol, lo recuperamos de BD para que sea una entidad gestionada.
        // Si no viene, asignamos ROLE_USUARIO por defecto.
        if (usuario.getRol() != null && usuario.getRol().getId() != null) {
            Rol rol = rolRepository.findById(usuario.getRol().getId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuario.setRol(rol);
        } else {
            Rol rolUsuario = rolRepository.findByRol(Rol.RolUsuario.ROLE_USUARIO)
                    .orElseThrow(() -> new RuntimeException("Rol ROLE_USUARIO no encontrado"));
            usuario.setRol(rolUsuario);
        }

        // Revisamos que el usuario no esté registrado anteriormente.
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        return usuarioRepository.save(usuario);
    }


    //Obtener todos los usuarios.
    public List<Usuario> obtenerTodos() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String rolActual = auth.getAuthorities().iterator().next().getAuthority();

        // Si es ADMIN → NO ver SUPERADMIN
        if (rolActual.equals("ROLE_ADMIN")) {
            return usuarioRepository.findByActiveTrueAndRol_RolNot(Rol.RolUsuario.ROLE_SUPERADMIN);
        }

        // SUPERADMIN ve todo
        return usuarioRepository.findByActiveTrue();
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

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String rolActual = auth.getAuthorities().iterator().next().getAuthority();

        // Si se intenta actualizar un SuperAdmin y no es SuperAdmin
        if (existente.getRol().getRol() == Rol.RolUsuario.ROLE_SUPERADMIN
                && !rolActual.equals("ROLE_SUPERADMIN")) {
            throw new RuntimeException("No tienes permisos para actualizar este rol");
        }

        // Si se envía nueva contraseña, la volvemos a encriptar
        if (nuevo.getPassword() != null)
            existente.setPassword(passwordEncoder.encode(nuevo.getPassword()));


        // Solo actualizamos campos que no sean null
        if (nuevo.getNombre() != null)
            existente.setNombre(nuevo.getNombre());

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

        // ADMIN puede cambiar roles normales, pero SOLO SUPERADMIN puede asignar SUPERADMIN
        if (nuevoRol == Rol.RolUsuario.ROLE_SUPERADMIN && !rolActual.equals("ROLE_SUPERADMIN")) {
            throw new RuntimeException("Solo SUPERADMIN puede asignar este rol");
        }

        // Obtener la entidad Rol correspondiente al enum recibido y asignarla al usuario.
        // Después se persiste el cambio y se recarga desde base de datos para asegurar
        // que la respuesta devuelve el estado actualizado (evitando datos en caché de Hibernate).
        Rol rol = rolRepository.findByRol(nuevoRol)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        existente.setRol(rol);

        // Guardar en BD
        usuarioRepository.save(existente);

        // IMPORTANTE: devolver actualizado (evita cache vieja)
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // Metodo para cambiar contraseña del usuario autenticado
    public void cambiarPassword(ChangePasswordRequest request) {

        // Obtenemos el usuario autenticado actual
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // getName() devuelve el username (email)

        // Buscamos usuario en base de datos
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        // Validamos que la contraseña actual sea correcta
        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual no es correcta.");
        }

        // Encriptamos la nueva contraseña
        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));

        // Guardamos cambios
        usuarioRepository.save(usuario);
    }


    // Eliminar usuario.
    public void eliminar(Integer id) {

        Usuario usuario = obtenerPorId(id);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String rolActual = auth.getAuthorities().iterator().next().getAuthority();

        // Si se intenta eliminar un SuperAdmin y no es SuperAdmin
        // Primer get rol obtenemos el objeto Rol de la clase Usuario y con el segundo el enum de RolUsuario(clase Rol)
        if (usuario.getRol().getRol() == Rol.RolUsuario.ROLE_SUPERADMIN
                && !rolActual.equals("ROLE_SUPERADMIN")) {
            throw new RuntimeException("No tienes permisos para eliminar este rol");
        }

        // Hard delete
        usuarioRepository.delete(usuario);

    }

    // Metodo para obtener el usuario autenticado a partir del objeto Authentication
    public Usuario obtenerUsuarioAutenticado(Authentication auth) {

        String email = auth.getName();

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

}
