package com.alten.remotesync.infrastructure.AuditConfig;

import com.alten.remotesync.application.user.service.UserService;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AuditorAwareImpl implements AuditorAware<User> {
    private final UserDomainRepository userDomainRepository;
    @Override
    public Optional<User> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        UserPrincipal userPrincipal= (UserPrincipal) authentication.getPrincipal();

        return Optional.of(userDomainRepository.findById(userPrincipal.userId()).orElseThrow());
    }
}