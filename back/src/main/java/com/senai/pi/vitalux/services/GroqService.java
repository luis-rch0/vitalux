package com.senai.pi.vitalux.services;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.senai.pi.vitalux.dtos.ChatRequestDTO;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class GroqService {

        private final WebClient webClient;

        @Value("${GROQ_API_KEY}")
        private String apiKey;

        public String generate(ChatRequestDTO request) {

                String systemContent = "Você é a Vitalux AI - Assistente Virtual de Saúde.\n" +
                                "\n" +
                                "OBJETIVO: Responder perguntas e dúvidas dos usuários sobre como funciona a aplicação Vitalux.\n"
                                +
                                "\n" +
                                "FLUXO DA APLICAÇÃO VITALUX:\n" +
                                "1. CLIENTE: Usuário que faz login e acessa a plataforma para agendar consultas e farmácia.\n"
                                +
                                "2. AGENDAMENTO: Cliente pode agendar consultas em clínicas disponíveis, escolhendo data, horário e profissional.\n"
                                +
                                "3. CONSULTA: Registro da consulta realizada com dados do cliente, clínica, diagnóstico e prescrição.\n"
                                +
                                "4. RECEITUÁRIO MÉDICO: Prescrição gerada automaticamente a partir da consulta.\n" +
                                "5. FARMÁCIA: Cliente busca medicamentos da receita em farmácias parceiras. Farmácia consulta listagem de medicamentos.\n"
                                +
                                "6. CONFORMIDADE LEGAL: Validação de dados sensíveis e conformidade com LGPD.\n" +
                                "\n" +
                                "ENTIDADES PRINCIPAIS:\n" +
                                "- Clínicas: Estabelecimentos de saúde que oferecem agendamentos\n" +
                                "- Profissionais de Saúde: Médicos/enfermeiros que atendem nas clínicas\n" +
                                "- Medicamentos: Disponíveis em farmácias parceiras\n" +
                                "- Clientes: Usuários finais que utilizam os serviços\n" +
                                "\n" +
                                "INSTRUÇÕES:\n" +
                                "- Responda em português brasileiro, de forma clara e concisa\n" +
                                "- Se a pergunta for sobre o fluxo da aplicação, explique com detalhes\n" +
                                "- Se não souber a resposta, ser honesto e sugerir que o usuário entre em contato com suporte\n"
                                +
                                "- Não execute ações (não crie agendamentos, não marque consultas). Apenas esclareça dúvidas\n"
                                +
                                "- Seja amigável e profissional";

                Map<String, Object> body = Map.of(
                                "model", "llama-3.3-70b-versatile",
                                "messages", List.of(
                                                Map.of("role", "system",
                                                                "content", systemContent),
                                                Map.of("role", "user",
                                                                "content", request.getMessage())));

                return webClient.post()
                                .uri("https://api.groq.com/openai/v1/chat/completions")
                                .header("Authorization", "Bearer " + apiKey)
                                .bodyValue(body)
                                .retrieve()
                                .bodyToMono(String.class)
                                .block();
        }
}