package com.alten.remotesync.infrastructure.WebSocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketSecurityConfig.class);

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        logger.info("Configuring WebSocket inbound message security...");
        messages


               .simpTypeMatchers(SimpMessageType.CONNECT).permitAll()

                .simpSubscribeDestMatchers("/topic/rotation").hasAnyRole("RC","ADMIN","ASSOCIATE")
                .simpSubscribeDestMatchers("/topic/chat").hasAnyRole("RC","ADMIN")
                .simpDestMatchers("/app/chat").hasAnyRole("RC","ADMIN")
                .anyMessage().denyAll();
    }


    @Override
    protected boolean sameOriginDisabled() {
        return true;
    }
}
//@Configuration
//@EnableWebSocketSecurity
//public class WebSocketSecurityConfig {
//    @Bean
//    @Order(Ordered.HIGHEST_PRECEDENCE) // Or a specific number like 0
//    public SecurityFilterChain webSocketHandshakeSecurityFilterChain(HttpSecurity http) throws Exception {
//
//        http
//                .securityMatcher("/ws/**") // Apply this filter chain only to paths starting with /ws (your STOMP endpoint)
//                .authorizeHttpRequests(authorize -> authorize
//                                .anyRequest().permitAll() // Allow all HTTP requests to /ws/** (for handshake and SockJS fallbacks)
//                        // Authentication will be handled at the STOMP protocol level by JwtAuthChannelInterceptor
//                )
//                .csrf(csrf -> csrf
//                        .ignoringRequestMatchers("/ws/**") // Disable CSRF for WebSocket handshake/SockJS endpoints
//                )
//                .sessionManagement(session -> session
//                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Usually stateless for token-based auth
//                );
//        return http.build();
//    }
//    @Bean
//    AuthorizationManager<Message<?>> authorizationManager(MessageMatcherDelegatingAuthorizationManager.Builder messages) {
//        messages
//                .anyMessage().permitAll();
//        return messages.build();
//    }
//}