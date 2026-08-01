import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  senha: z.string().min(8, "A senha deve ter ao menos 8 caracteres"),
});

export const patientRegistrationSchema = z.object({
  nome: z.string().min(3, "Informe seu nome completo"),
  cpf: z.string().refine(value => value.replace(/\D/g, "").length === 11, "Informe um CPF com 11 dígitos"),
  dataNascimento: z.string().min(1, "Data obrigatória"),
  telefone: z.string().refine(value => {
    const length = value.replace(/\D/g, "").length;
    return length === 10 || length === 11;
  }, "Informe um telefone válido"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "Senha com ao menos 8 caracteres"),
  endereco: z.string().min(5, "Endereço obrigatório"),
  necessidadesCuidado: z.string().optional(),
  familiarResponsavel: z.string().optional(),
});
