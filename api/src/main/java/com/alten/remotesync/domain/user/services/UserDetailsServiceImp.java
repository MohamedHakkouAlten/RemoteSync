package com.alten.remotesync.domain.user.services;

import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserDetailsServiceImp implements UserDetailsService {
    private final UserDomainRepository userDomainRepository;

    @Override
    public User loadUserByUsername(String username) {
        return userDomainRepository.findByUsername(username);
    }
}