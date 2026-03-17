package com.inplay.dto;

import com.inplay.entity.Rol;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeRolRequest {

    private Rol.RolUsuario nuevoRol;
}
