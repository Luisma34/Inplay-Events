package com.inplay.security;

import com.inplay.entity.Usuario;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    public String generateToken(Usuario usuario) {
        return "TOKEN_TEMPORAL";
    }
}
