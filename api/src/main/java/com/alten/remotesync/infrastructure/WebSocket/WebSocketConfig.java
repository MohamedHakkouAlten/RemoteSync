package com.alten.remotesync.infrastructure.WebSocket;


import com.alten.remotesync.kernel.security.jwt.JwtService;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);
    private final JwtService jwtService;
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {

        config.enableSimpleBroker("/topic");

        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);


                assert accessor != null;
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                   try {
                       String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
                       assert authorizationHeader != null;
                       String token = authorizationHeader.substring(7);

                       String username = jwtService.extractUsername(token);
                       logger.warn("STOMP Connect: Expired JWT token: {}", username);
                       UserPrincipal userPrincipal = new UserPrincipal(jwtService.extractUserId(token), username);
                       UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userPrincipal, null, jwtService.extractAuthorities(token));
                       SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

                       accessor.setUser(usernamePasswordAuthenticationToken);
                   }  catch (ExpiredJwtException e) {
                    logger.warn("STOMP Connect: Expired JWT token: {}", e.getMessage());
                    throw new BadCredentialsException("Expired JWT token", e);
                } catch (UnsupportedJwtException e) {
                    logger.warn("STOMP Connect: Unsupported JWT token: {}", e.getMessage());
                    throw new BadCredentialsException("Unsupported JWT token", e);
                } catch (MalformedJwtException e) {
                    logger.warn("STOMP Connect: Invalid JWT token: {}", e.getMessage());
                    throw new BadCredentialsException("Invalid JWT token", e);
                } catch (SignatureException e) {
                    logger.warn("STOMP Connect: Invalid JWT signature: {}", e.getMessage());
                    throw new BadCredentialsException("Invalid JWT signature", e);
                } catch (IllegalArgumentException e) {
                    logger.warn("STOMP Connect: JWT claims string is empty: {}", e.getMessage());
                    throw new BadCredentialsException("JWT claims string is empty", e);
                } catch (Exception e) { // Catch any other parsing/validation errors
                    logger.error("STOMP Connect: JWT authentication failed: {}", e.getMessage(), e);
                    throw new BadCredentialsException("JWT authentication failed", e);
                }
                }

                return message;
            }

        });
    }
}