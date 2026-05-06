package com.moedaestudantil.controller;

import com.moedaestudantil.dto.LoginRequest;
import com.moedaestudantil.dto.UsuarioResponse;
import com.moedaestudantil.model.Usuario;
import com.moedaestudantil.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("erro", "E-mail ou senha inválidos."));
        }

        Usuario usuario = usuarioOpt.get();

        if (!usuario.getSenha().equals(request.getSenha())) {
            return ResponseEntity.status(401).body(Map.of("erro", "E-mail ou senha inválidos."));
        }

        return ResponseEntity.ok(UsuarioResponse.from(usuario));
    }
}
