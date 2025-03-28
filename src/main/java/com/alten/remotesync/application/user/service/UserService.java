package com.alten.remotesync.application.user.service;

import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.application.user.record.request.UpdateUserProfileDTO;
import com.alten.remotesync.application.user.record.response.LoginResponseDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface UserService {
    UserProfileDTO getMyProfile(UUID userId);
    UserProfileDTO updateMyProfile(UUID userId, UpdateUserProfileDTO updateUserProfileDTO);
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);

}
