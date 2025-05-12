package com.alten.remotesync.application.user.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.application.user.record.request.UpdateUserProfileDTO;
import com.alten.remotesync.application.user.record.response.LoginResponseDTO;
import com.alten.remotesync.application.user.record.response.UserDropDownDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    UserProfileDTO getMyProfile(GlobalDTO globalDTO);
    UserProfileDTO updateMyProfile(UpdateUserProfileDTO updateUserProfileDTO);
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
    Integer getRcCountTotalAssociates(String role);
    List<UserDropDownDTO> getRCUsersByName(String name);
}
