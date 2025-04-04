package com.alten.remotesync.application.user.mapper;

import com.alten.remotesync.application.user.record.response.AssignedRotationDTO;
import com.alten.remotesync.application.user.record.response.UserProfileDTO;
import com.alten.remotesync.domain.user.model.User;
import java.util.List;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-03T16:42:12+0000",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.14 (Azul Systems, Inc.)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserProfileDTO toUserProfileDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UUID userId = null;
        String firstName = null;
        String lastName = null;
        String email = null;
        String username = null;
        String phoneNumber = null;

        userId = user.getUserId();
        firstName = user.getFirstName();
        lastName = user.getLastName();
        email = user.getEmail();
        username = user.getUsername();
        phoneNumber = user.getPhoneNumber();

        List<AssignedRotationDTO> assignedRotations = null;

        UserProfileDTO userProfileDTO = new UserProfileDTO( userId, firstName, lastName, email, username, phoneNumber, assignedRotations );

        return userProfileDTO;
    }
}
