package br.com.carepoint.dto;

/** Dados completos para uso administrativo; CPF não é exposto no marketplace público. */
public record ProfessionalAdminResponse(ProfessionalResponse profissional, String cpf) { }
