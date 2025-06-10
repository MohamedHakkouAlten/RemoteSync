package com.alten.remotesync.application.user.service;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.user.record.request.*;
import com.alten.remotesync.application.user.record.response.*;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public interface UserService {
    AssociateProfileDTO getAssociateProfile(GlobalDTO globalDTO);
    UserProfileDTO getMyProfile(GlobalDTO globalDTO);
    UserProfileDTO updateMyProfile(UpdateUserProfileDTO updateUserProfileDTO);
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
    Integer getRcCountTotalAssociates(String role);
    // IT WAS BEFORE UserDropDownDTO
    List<UserDTO> getRCUsersByName(String name);
    LoginResponseDTO refreshToken(UserPrincipal userPrincipal);
    //List<UserDTO> getRcAllAssociatesWithoutAssignedRotation(RcSearchAssociateDTO rcSearchAssociateDTO);
    Boolean recoverPassword(RecoverPasswordDTO recoverPasswordDTO) throws MessagingException;

    LoginResponseDTO resetPassword(GlobalDTO globalDTO, ResetPasswordDTO resetPasswordDTO) throws MessagingException;

    AssociateProfileDTO associateUpdateProfile(GlobalDTO globalDTO, AssociateUpdateProfileDTO associateUpdateProfileDTO);
}
