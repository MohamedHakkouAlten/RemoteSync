package com.alten.remotesync.application.user.mapper;

import com.alten.remotesync.application.user.record.response.AssociateProfileDTO;
import com.alten.remotesync.application.user.record.response.UserDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import com.alten.remotesync.domain.user.model.User;

import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserProfileDTO toUserProfileDTO(User user);

    AssociateProfileDTO toAssociateProfileDTO(User user);

    UserDTO toUserDTO(User user);
}
