import type { Intent } from "./api";
export type Understanding = { intent: Intent; search?: string; task?: "CREATE" | "CANCEL" };
/** Small explicit command vocabulary. This is local routing, not an LLM response. */
export function understand(message: string): Understanding {
  const text = message
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (/\b(cancelar|cancele|cancel)\b/.test(text)) return { intent: "HELP", task: "CANCEL" };
  if (/\b(agendar|agende|marcar|solicitar|book|schedule)\b/.test(text))
    return { intent: "HELP", task: "CREATE" };
  if (
    /\b(minhas? solicitacoes|meus pedidos|meus atendimentos|my requests|my appointments)\b/.test(
      text,
    )
  )
    return { intent: "MY_REQUESTS" };
  if (/\b(clinicas?|clinics?)\b/.test(text)) return { intent: "CLINICS" };
  const specialties = ["fisioterapia", "enfermagem", "nutricao", "psicologia", "fonoaudiologia"];
  const specialty = specialties.find((word) => text.includes(word));
  if (specialty || /\b(profissiona(?:l|is)|professionals?)\b/.test(text))
    return { intent: "PROFESSIONALS", search: specialty === "nutricao" ? "nutrição" : specialty };
  return { intent: "HELP" };
}
