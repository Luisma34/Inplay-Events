package com.inplay.controller;

import com.inplay.entity.Liga;
import com.inplay.entity.Usuario;
import com.inplay.service.LigaService;
import com.inplay.service.LigaUsuarioService;
import com.inplay.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ligas")
// @RequiredArgsConstructor es una anotación de Lombok que genera un constructor con argumentos
// para todos los campos finales (final) o marcados como @NonNull.
// En este caso, se utiliza para inyectar el servicio LigaService sin necesidad de escribir un constructor explícito.
@RequiredArgsConstructor
public class LigaController {

    // Inyección de dependencias
    // LigaService es una clase de servicio que contiene la lógica de negocio relacionada con las ligas.
    private final LigaService ligaService;
    private final UsuarioService usuarioService;
    private final LigaUsuarioService ligaUsuarioService;

    // El metodo obtenerTodas() maneja las solicitudes GET a la ruta "/api/ligas".
    // Utiliza el servicio para obtener todas las ligas y devuelve una respuesta HTTP con la lista de ligas.
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Liga>> obtenerTodas() {
        List<Liga> ligas = ligaService.obtenerTodas();
        return ResponseEntity.ok(ligas);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PutMapping("{id}")
    public ResponseEntity<Liga> actualizar(@RequestBody Liga liga, @PathVariable Integer id){

        Liga existente = ligaService.obtenerPorId(id);

        if (liga.getNombre() != null)
            existente.setNombre(liga.getNombre());

        if (liga.getCategoria() != null)
            existente.setCategoria(liga.getCategoria());

        if (liga.getDivision() != null)
            existente.setDivision(liga.getDivision());

        if (liga.getEstado() != null)
            existente.setEstado(liga.getEstado());

        return ResponseEntity.ok(ligaService.guardar(existente));
    }

    // El metodo createLiga() maneja las solicitudes POST a la ruta "/api/ligas".
    // Recibe un objeto Liga en el cuerpo de la solicitud, lo guarda utilizando el servicio
    // y devuelve una respuesta HTTP con la liga creada.
    // @RequestBody se utiliza para indicar que el objeto Liga debe ser deserializado a partir del cuerpo de la solicitud HTTP.
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @PostMapping
    public ResponseEntity<Liga> createLiga(@RequestBody Liga liga) {
        Liga createdLiga = ligaService.guardar(liga);
        return ResponseEntity.status(201).body(createdLiga);
    }

    // El metodo unirseLiga() maneja las solicitudes POST a la ruta "/api/ligas/{ligaId}/unirse".
    // Recibe un ID de liga como parte de la URL y la autenticación del usuario que realiza la solicitud.
    // Utiliza el servicio para obtener el usuario autenticado.
    // Luego, llama al servicio LigaUsuarioService para que el usuario se una a la liga especificada.
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{ligaId}/unirse")
    public ResponseEntity<?> unirseLiga(@PathVariable Integer ligaId, Authentication auth) {

        try {

            Usuario usuario = usuarioService.obtenerUsuarioAutenticado(auth);

            ligaUsuarioService.unirse(ligaId, usuario.getId());

            return ResponseEntity.ok().build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(409)
                    .body("Ya estás inscrito en esta liga");
        }
    }

    // Metodo para borrarse de una liga.
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{ligaId}/salir")
    public ResponseEntity<?> salirLiga(@PathVariable Integer ligaId, Authentication auth) {

        Usuario usuario = usuarioService.obtenerUsuarioAutenticado(auth);

        ligaUsuarioService.salir(ligaId, usuario.getId());

        return ResponseEntity.ok(Map.of("ok", true));
    }

    // Ver ligas donde se ha inscrito el usuario.
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mis-ligas")
    public List<Liga> misLigas(Authentication auth) {

        Usuario usuario = usuarioService.obtenerUsuarioAutenticado(auth);

        return ligaUsuarioService.obtenerLigasDeUsuario(usuario.getId());
    }


    // El metodo deleteLiga() maneja las solicitudes DELETE a la ruta "/api/ligas/{id}".
    // Recibe un ID de liga como parte de la URL, elimina la liga correspondiente utilizando el servicio
    // y devuelve una respuesta HTTP sin contenido.
    //@PathVariable se utiliza para indicar que el valor del ID debe ser extraído de la URL de la solicitud.
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        ligaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
