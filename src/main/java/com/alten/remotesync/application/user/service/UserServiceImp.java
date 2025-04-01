package com.alten.remotesync.application.user.service;

import com.alten.remotesync.adapter.exception.user.UserDisabledException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.user.mapper.UserMapper;
import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.application.user.record.request.UpdateUserProfileDTO;
import com.alten.remotesync.application.user.record.response.LoginResponseDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import com.alten.remotesync.kernel.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    private final UserDomainRepository userDomainRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public UserProfileDTO getMyProfile(GlobalDTO globalDTO) {
        User dbuser = userDomainRepository.findById(globalDTO.userId())
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + globalDTO.userId()));
        return userMapper.toUserProfileDTO(dbuser);
    }

    @Override
    public UserProfileDTO updateMyProfile(UpdateUserProfileDTO updateUserProfileDTO) {
        User dbUser = userDomainRepository.findById(updateUserProfileDTO.userId())
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + updateUserProfileDTO.userId()));

        dbUser.setFirstName(updateUserProfileDTO.firstName());
        dbUser.setLastName(updateUserProfileDTO.lastName());
        dbUser.setEmail(updateUserProfileDTO.email());
        dbUser.setPhoneNumber(updateUserProfileDTO.phoneNumber());

        return userMapper.toUserProfileDTO(userDomainRepository.save(dbUser));
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.username(), loginRequestDTO.password()));

        if(!authentication.isAuthenticated()) throw new UserNotFoundException("Authentication failed user was not found");

        User dbUser = userDomainRepository.findByUsername(loginRequestDTO.username());

        if(dbUser.isDeleted()) throw new UserDisabledException("Authentication failed account disabled");

        return new LoginResponseDTO(jwtService.generateAccessToken(dbUser), jwtService.generateRefreshToken(dbUser));
    }
}
