package br.com.carepoint.dto;

import br.com.carepoint.entity.Role;

public record AuthUserResponse(Long id, String nome, String email, Role role, Long pacienteId) { }
