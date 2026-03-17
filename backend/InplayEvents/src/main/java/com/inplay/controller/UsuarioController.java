package com.inplay.controller;

import com.inplay.dto.ChangePasswordRequest;
import com.inplay.dto.ChangeRolRequest;
import com.inplay.entity.Usuario;
import com.inplay.repository.UsuarioRepository;
import com.inplay.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    // GET /api/usuarios -> Listar todos los usuarios activos
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @GetMapping
    public ResponseEntity <List<Usuario>> obtenerTodos() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    // GET /api/usuarios/{id} -> Obtener un usuario por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    // POST /api/usuarios → crear
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario) {
        return ResponseEntity.status(201).body(usuarioService.guardar(usuario));
    }

    // PUT /api/usuarios/{id} -> Actualizar un usuario existente
    // @PathVariable se usa para extraer el ID de la URL,
    // y @RequestBody para obtener los datos del usuario desde el cuerpo de la solicitud.
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public ResponseEntity<Usuario> actualizar(@PathVariable Integer id,
                                              @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.actualizar(id, usuario));
    }

    @PutMapping("/{id}/rol")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public ResponseEntity<Usuario> cambiarRol(
            @PathVariable Integer id,
            @RequestBody ChangeRolRequest request) {

        return ResponseEntity.ok(usuarioService.cambiarRol(id, request.getNuevoRol()));
    }

    // Cambiar contraseña del usuario autenticado
    // Solo requiere estar autenticado
    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cambiarPassword(@RequestBody ChangePasswordRequest request) {

        usuarioService.cambiarPassword(request);

        return ResponseEntity.ok("Contraseña actualizada correctamente.");
    }

    // DELETE /api/usuarios/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
