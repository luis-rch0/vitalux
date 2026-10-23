package br.com.carepoint.assistant;

import br.com.carepoint.exception.ResourceNotFoundException;
import java.util.Comparator;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConversationService {
  private final ConversationRepository conversations;
  private final MessageRepository messages;

  public ConversationService(ConversationRepository conversations, MessageRepository messages) {
    this.conversations = conversations;
    this.messages = messages;
  }

  @Transactional(readOnly = true)
  public List<AssistantContracts.Conversation> list(Long userId) {
    return conversations.findTop30ByUserIdOrderByUpdatedAtDesc(userId).stream()
        .map(c -> new AssistantContracts.Conversation(c.getId(), c.getTitle(), c.getUpdatedAt()))
        .toList();
  }

  @Transactional(readOnly = true)
  public List<AssistantContracts.Message> history(Long userId, Long id, int page) {
    owned(userId, id);
    return messages
        .findByConversationIdOrderByIdDesc(id, PageRequest.of(Math.max(0, page), 50))
        .getContent()
        .stream()
        .sorted(Comparator.comparing(ChatMessage::getId))
        .map(
            m ->
                new AssistantContracts.Message(
                    m.getId(), m.getRole(), m.getContent(), m.getCreatedAt()))
        .toList();
  }

  @Transactional(readOnly = true)
  public void verifyOwner(Long userId, Long id) {
    if (id != null) owned(userId, id);
  }

  @Transactional
  public Long append(Long userId, Long id, String question, String answer) {
    ChatConversation conversation =
        id == null
            ? conversations.save(
                new ChatConversation(
                    userId, question.substring(0, Math.min(100, question.length()))))
            : owned(userId, id);
    conversation.touch();
    messages.save(new ChatMessage(conversation.getId(), "USER", question));
    messages.save(new ChatMessage(conversation.getId(), "ASSISTANT", answer));
    return conversation.getId();
  }

  @Transactional
  public void delete(Long userId, Long id) {
    conversations.delete(owned(userId, id));
  }

  private ChatConversation owned(Long userId, Long id) {
    return conversations
        .findByIdAndUserId(id, userId)
        .orElseThrow(() -> new ResourceNotFoundException("Conversa"));
  }
}
