package br.com.carepoint.assistant;

import java.text.Normalizer;
import java.util.Locale;

/** Explicit platform help when the optional language provider is unavailable. */
final class GuidedHelp {
  private GuidedHelp() {}

  static String answer(String question, boolean english) {
    String text = Normalizer.normalize(question, Normalizer.Form.NFD)
        .replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT);
    if (text.matches(".*(perfil|profile|senha|password|endereco|address).*")) {
      return english
          ? "Open Edit profile to change your contact details, care address or password. Which detail would you like to change?"
          : "Em Editar perfil você pode atualizar contato, endereço e senha. Qual desses dados você quer alterar?";
    }
    if (text.matches(".*(status|pendente|pending|confirm).*")) {
      return english
          ? "New requests start as pending. The care team confirms them. Use My requests for the actual status; sending a request does not guarantee availability."
          : "Novas solicitações começam como pendentes. A administração confirma o atendimento. Use Meus pedidos para consultar o status real; enviar um pedido não garante disponibilidade.";
    }
    if (text.matches(".*(avali|review).*")) {
      return english
          ? "Open a completed request to leave a review. The care team must first mark it as completed."
          : "Abra um atendimento concluído para deixar sua avaliação. A administração precisa primeiro marcá-lo como concluído.";
    }
    if (text.matches("(oi|ola|hello|hi|bom dia|boa tarde|boa noite)[!. ]*")) {
      return english
          ? "Hello! Would you like to find a professional, request care or follow an existing request? You can type your choice."
          : "Olá! Você quer encontrar um profissional, solicitar atendimento ou acompanhar um pedido? Pode escrever sua escolha.";
    }
    return english
        ? "I am in guided mode and could not identify this question. Try 'my requests', 'book care', 'cancel request' or 'edit profile'. Open-ended platform questions require external AI enabled and configured on the server."
        : "Estou no modo guiado e não consegui identificar essa dúvida. Experimente 'meus pedidos', 'agendar atendimento', 'cancelar pedido' ou 'editar perfil'. Perguntas abertas sobre a plataforma precisam da IA externa ativada e configurada no servidor.";
  }
}
