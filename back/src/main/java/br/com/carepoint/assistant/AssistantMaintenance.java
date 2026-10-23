package br.com.carepoint.assistant;

import java.time.Instant;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@EnableScheduling
public class AssistantMaintenance {
  private final ActionRepository actions;

  public AssistantMaintenance(ActionRepository actions) {
    this.actions = actions;
  }

  @Scheduled(fixedDelay = 3600000, initialDelay = 60000)
  @Transactional
  public void purgeExpiredDrafts() {
    Instant now = Instant.now();
    actions.deleteExpired(now, now.minusSeconds(30L * 24 * 60 * 60));
  }
}
