package com.alten.remotesync.infrastructure.AuditConfig;

import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

@Configuration
@RequiredArgsConstructor
public class AuditingConfig {
    private final UserDomainRepository userDomainRepository;
    @Bean
    public AuditorAware<User> auditorAware() {
        return new AuditorAwareImpl(userDomainRepository);
    }
}

