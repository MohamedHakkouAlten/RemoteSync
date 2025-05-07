package com.alten.remotesync.application.user.service;

import com.alten.remotesync.adapter.exception.role.RoleNotFoundException;
import com.alten.remotesync.adapter.exception.user.UserDisabledException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.user.mapper.UserMapper;
import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.application.user.record.request.UpdateUserProfileDTO;
import com.alten.remotesync.application.user.record.response.LoginResponseDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import com.alten.remotesync.domain.role.repository.RoleDomainRepository;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import com.alten.remotesync.kernel.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    private final UserDomainRepository userDomainRepository;
    private final RoleDomainRepository roleDomainRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public UserProfileDTO getMyProfile(GlobalDTO globalDTO) {
        User dbuser = userDomainRepository.findById(globalDTO.userId()).orElseThrow(() -> new UserNotFoundException("User not found with id: " + globalDTO.userId()));
        return userMapper.toUserProfileDTO(dbuser);
    }

    @Override
    public UserProfileDTO updateMyProfile(UpdateUserProfileDTO updateUserProfileDTO) {
        User dbUser = userDomainRepository.findById(updateUserProfileDTO.userId()).orElseThrow(() -> new UserNotFoundException("User not found with id: " + updateUserProfileDTO.userId()));

        dbUser.setFirstName(updateUserProfileDTO.firstName());
        dbUser.setLastName(updateUserProfileDTO.lastName());
        dbUser.setEmail(updateUserProfileDTO.email());
        dbUser.setPhoneNumber(updateUserProfileDTO.phoneNumber());

        return userMapper.toUserProfileDTO(userDomainRepository.save(dbUser));
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User dbUser = (loginRequestDTO.usernameOrEmail().contains("@")) ? userDomainRepository.findByEmail(loginRequestDTO.usernameOrEmail()) : userDomainRepository.findByUsername(loginRequestDTO.usernameOrEmail());

        if(dbUser.isDeleted()) throw new UserDisabledException("Authentication failed account disabled");

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dbUser.getUsername(), loginRequestDTO.password()));

        if (!authentication.isAuthenticated())
            throw new UserNotFoundException("Authentication failed user was not found");



        return new LoginResponseDTO(jwtService.generateAccessToken(dbUser), jwtService.generateRefreshToken(dbUser), dbUser.getFirstName(), dbUser.getLastName(), dbUser.getRoles().stream().map(r -> String.valueOf(r.getAuthority())).toList());
    }

    @Override
    public Integer getRcCountTotalAssociates(String role) {
        return userDomainRepository.countAllByRoles(List.of(roleDomainRepository.findByAuthority(role).orElseThrow(() -> new RoleNotFoundException("Role not found"))));
    }
}
