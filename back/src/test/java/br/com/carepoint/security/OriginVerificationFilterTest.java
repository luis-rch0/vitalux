package br.com.carepoint.security;

import static org.junit.jupiter.api.Assertions.*;

import br.com.carepoint.config.CorsProperties;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.*;

class OriginVerificationFilterTest {
  private OriginVerificationFilter filter() {
    var properties = new CorsProperties();
    properties.setAllowedOrigins("http://localhost:3000");
    return new OriginVerificationFilter(properties);
  }

  @Test
  void rejectsUntrustedOrigin() throws Exception {
    var request = new MockHttpServletRequest("POST", "/api/assistant/messages");
    request.addHeader("Origin", "https://attacker.example");
    var response = new MockHttpServletResponse();
    filter().doFilter(request, response, new MockFilterChain());
    assertEquals(403, response.getStatus());
  }

  @Test
  void rejectsCookieMutationWithoutProvenance() throws Exception {
    var request = new MockHttpServletRequest("POST", "/api/assistant/actions");
    request.setCookies(new Cookie("carepoint_access", "test"));
    var response = new MockHttpServletResponse();
    filter().doFilter(request, response, new MockFilterChain());
    assertEquals(403, response.getStatus());
  }

  @Test
  void permitsAllowedBrowserOrigin() throws Exception {
    var request = new MockHttpServletRequest("POST", "/api/assistant/messages");
    request.setCookies(new Cookie("carepoint_access", "test"));
    request.addHeader("Origin", "http://localhost:3000");
    var response = new MockHttpServletResponse();
    var chain = new MockFilterChain();
    filter().doFilter(request, response, chain);
    assertNotNull(chain.getRequest());
  }

  @Test
  void permitsNonCookieApiClients() throws Exception {
    var request = new MockHttpServletRequest("POST", "/api/assistant/messages");
    request.addHeader("Authorization", "Bearer test");
    var response = new MockHttpServletResponse();
    var chain = new MockFilterChain();
    filter().doFilter(request, response, chain);
    assertNotNull(chain.getRequest());
  }
}
