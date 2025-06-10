package com.alten.remotesync.kernel.security.jwt;

import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);
            UUID userId = jwtService.extractUserId(jwt);

            if (userId != null && userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                String tokenType = jwtService.extractClaim(jwt, claims -> claims.get("type", String.class));
                Instant expirationTime = jwtService.extractClaim(jwt, claims -> claims.getExpiration().toInstant());
                boolean isTokenValid = jwtService.isTokenValid(jwt, userEmail);
                String path = request.getServletPath();

                if (!isTokenValid) {
                    sendJsonResponse(
                            response,
                            HttpServletResponse.SC_UNAUTHORIZED,
                            "Token Validation Failed",
                            "The token is invalid or has expired. Please log in again or use a refresh token.",
                            tokenType,
                            expirationTime,
                            userEmail
                    );
                    return;
                }

                if (!isTokenAllowedForEndpoint(tokenType, path)) {
                    sendJsonResponse(
                            response,
                            HttpServletResponse.SC_FORBIDDEN,
                            "Invalid Token Type",
                            getTokenTypeErrorMessage(tokenType, path),
                            tokenType,
                            expirationTime,
                            userEmail
                    );
                    return;
                }

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        new UserPrincipal(userId, userEmail),
                        null,
                        jwtService.extractAuthorities(jwt)
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            sendJsonResponse(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Token Expired",
                    "Your session has expired. Please log in again.",
                    null, null, null
            );

            return;
        } catch (Exception exception) {
            sendJsonResponse(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Authentication Failed",
                    "Invalid authentication token or credentials.",
                    null, null, null
            );
            return;
        }
    }

    private void sendJsonResponse(HttpServletResponse response,
                                  int status,
                                  String errorTitle,
                                  String errorDetail,
                                  String tokenType,
                                  Instant expirationTime,
                                  String userEmail) throws IOException {

        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status);
        body.put("error", errorTitle);
        body.put("message", errorDetail);

        if (tokenType != null) body.put("tokenType", tokenType);
        if (expirationTime != null) body.put("expiresAt", expirationTime.toString());
        if (userEmail != null) body.put("userEmail", userEmail);

        objectMapper.writeValue(response.getWriter(), body);
    }

    private static final String REFRESH_ENDPOINT = "/api/v1/auth/refresh-token";
    private static final String RESET_PASSWORD_ENDPOINT = "/api/v1/auth/reset-password";

    private static final String TOKEN_TYPE_REFRESH = "refresh";
    private static final String TOKEN_TYPE_RESET_PASSWORD = "reset-password";


    private boolean isTokenAllowedForEndpoint(String tokenType, String path) {
        return switch (path) {
            case REFRESH_ENDPOINT -> TOKEN_TYPE_REFRESH.equals(tokenType);
            case RESET_PASSWORD_ENDPOINT -> TOKEN_TYPE_RESET_PASSWORD.equals(tokenType);
            default -> !TOKEN_TYPE_REFRESH.equals(tokenType) && !TOKEN_TYPE_RESET_PASSWORD.equals(tokenType);
        };
    }

    private String getTokenTypeErrorMessage(String tokenType, String path) {
        return switch (path) {
            case REFRESH_ENDPOINT -> "Access token cannot be used to refresh session. Please use a valid refresh token.";
            case RESET_PASSWORD_ENDPOINT -> "This endpoint requires a reset-password token. Access denied.";
            default -> "The provided token type is not allowed for this endpoint.";
        };
    }
}
