package com.alten.remotesync.application.user.service;

import com.alten.remotesync.application.user.mapper.UserMapper;
import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.application.user.record.request.UpdateUserProfileDTO;
import com.alten.remotesync.application.user.record.response.LoginResponseDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import com.alten.remotesync.domain.user.services.UserDetailsServiceImp;
import com.alten.remotesync.kernel.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserServiceImp implements UserService {

    private final UserDomainRepository userDomainRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDomainRepository userRepository;
    private final UserDetailsServiceImp userDetailsService;

    @Override
    public UserProfileDTO getMyProfile(UUID userId) {
        User user = userDomainRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return userMapper.toUserProfileDTO(user);
    }

    @Override
    @Transactional
    public UserProfileDTO updateMyProfile(UUID userId, UpdateUserProfileDTO updateUserProfileDTO) {
        User user = userDomainRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setFirstName(updateUserProfileDTO.firstName());
        user.setLastName(updateUserProfileDTO.lastName());
        user.setEmail(updateUserProfileDTO.email());
        user.setPhoneNumber(updateUserProfileDTO.phoneNumber());
        user.setPassword(passwordEncoder.encode(updateUserProfileDTO.password()));
        User updatedUser = userDomainRepository.save(user);
        return userMapper.toUserProfileDTO(updatedUser);
    }




    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        try {
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginRequestDTO.username(), loginRequestDTO.password());

            authenticationManager.authenticate(authenticationToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDTO.username());
            User user = userDomainRepository.findByUsername(loginRequestDTO.username());
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            String accessToken = jwtService.generateAccessToken(user);


            return new LoginResponseDTO(accessToken);
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid credentials", e);
        }
    }


}
