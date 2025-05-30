package com.alten.remotesync.application.user.service;

import com.alten.remotesync.adapter.exception.role.RoleNotFoundException;
import com.alten.remotesync.adapter.exception.user.UserDisabledException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.user.mapper.UserMapper;
import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.application.user.record.request.UpdateUserProfileDTO;
import com.alten.remotesync.application.user.record.response.*;
import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.role.repository.RoleDomainRepository;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import com.alten.remotesync.kernel.security.jwt.JwtService;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    private final UserDomainRepository userDomainRepository;
    private final RoleDomainRepository roleDomainRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AssociateProfileDTO getAssociateProfile(GlobalDTO globalDTO) {
        User dbuser = userDomainRepository.findById(globalDTO.userId()).orElseThrow(() -> new UserNotFoundException("User not found with id: " + globalDTO.userId()));
        return userMapper.toAssociateProfileDTO(dbuser);
    }

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

    @Override
    public List<UserDropDownDTO> getRCUsersByName(String name) {
        return userDomainRepository.findTop10ByFullNameContainingIgnoreCase(name, PageRequest.of(0,10)).orElseThrow(()->new UserNotFoundException("this user doesn t exist")).stream().map(user->new UserDropDownDTO(user.getUserId(), user.getFirstName()+" "+user.getLastName())).toList();
    }

    @Override
    public LoginResponseDTO refreshToken(UserPrincipal userPrincipal) {
       User user =userDomainRepository.findById(userPrincipal.userId()).orElseThrow(()->new UserNotFoundException("User not found"));
        if(user.isDeleted()) throw new UserDisabledException("Authentication failed account disabled");
        return new LoginResponseDTO(jwtService.generateAccessToken(user), jwtService.generateRefreshToken(user), user.getFirstName(), user.getLastName(), user.getRoles().stream().map(r -> String.valueOf(r.getAuthority())).toList());
    }

    @Override
    public List<UserDTO> getRcAllAssociatesWithoutAssignedRotation(RcSearchAssociateDTO rcSearchAssociateDTO) {
        Specification<User> spec = (root, query, criteriaBuilder) -> {
            query.distinct(true);

            Subquery<UUID> subquery = query.subquery(UUID.class);
            Root<AssignedRotation> subRoot = subquery.from(AssignedRotation.class);
            subquery.select(subRoot.get("user").get("userId"));
            subquery.where(
                    criteriaBuilder.and(
                            criteriaBuilder.equal(subRoot.get("user").get("userId"), root.get("userId")),
                            subRoot.get("rotationAssignmentStatus").in(
                                    RotationAssignmentStatus.ACTIVE,
                                    RotationAssignmentStatus.PENDING
                            )
                    )
            );

            Predicate noActiveOrPending = criteriaBuilder.not(criteriaBuilder.exists(subquery));

            Predicate namePredicate = criteriaBuilder.conjunction(); // default true
            if (rcSearchAssociateDTO.fullName() != null && !rcSearchAssociateDTO.fullName().isBlank()) {
                String likePattern = "%" + rcSearchAssociateDTO.fullName().toLowerCase() + "%";

                Expression<String> fullNameExpr = criteriaBuilder.lower(
                        criteriaBuilder.concat(
                                criteriaBuilder.concat(root.get("firstName"), " "),
                                root.get("lastName")
                        )
                );
                namePredicate = criteriaBuilder.like(fullNameExpr, likePattern);
            }

            return criteriaBuilder.and(noActiveOrPending, namePredicate);
        };

        List<User> users = userDomainRepository.findAll(spec);

        return users.stream()
                .map(userMapper::toUserDTO)
                .toList();
    }
}
