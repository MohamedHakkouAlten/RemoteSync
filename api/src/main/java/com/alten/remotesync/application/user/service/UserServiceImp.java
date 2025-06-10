package com.alten.remotesync.application.user.service;

import com.alten.remotesync.adapter.exception.role.RoleNotFoundException;
import com.alten.remotesync.adapter.exception.user.UserDisabledException;
import com.alten.remotesync.adapter.exception.user.UserNotFoundException;
import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.user.mapper.UserMapper;
import com.alten.remotesync.application.user.record.request.*;
import com.alten.remotesync.application.user.record.response.*;
import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.role.repository.RoleDomainRepository;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.projection.UserProjection;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import com.alten.remotesync.infrastructure.mail.MailUtility;
import com.alten.remotesync.kernel.security.jwt.JwtService;
import com.alten.remotesync.kernel.security.jwt.userPrincipal.UserPrincipal;
import jakarta.mail.MessagingException;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    private final MailUtility mailUtility;
    private final PasswordEncoder passwordEncoder;

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
        User dbUser = (loginRequestDTO.usernameOrEmail().contains("@"))
                ? userDomainRepository.findByEmail(loginRequestDTO.usernameOrEmail())
                .orElseThrow(() -> new UserNotFoundException("No account found with the provided email address."))
                : userDomainRepository.findByUsername(loginRequestDTO.usernameOrEmail())
                .orElseThrow(() -> new UserNotFoundException("No account found with the provided username."));

        if (dbUser.isDeleted()) throw new UserDisabledException("This account has been disabled. Please contact support for assistance.");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dbUser.getUsername(), loginRequestDTO.password())
        );

        if (!authentication.isAuthenticated()) throw new UserNotFoundException("Authentication failed. Incorrect username/email or password.");

        return new LoginResponseDTO(
                jwtService.generateAccessToken(dbUser),
                jwtService.generateRefreshToken(dbUser),
                dbUser.getFirstName(),
                dbUser.getLastName(),
                dbUser.getRoles().stream()
                        .map(r -> String.valueOf(r.getAuthority()))
                        .toList()
        );
    }

    @Override
    public Integer getRcCountTotalAssociates(String role) {
        return userDomainRepository.countAllByRoles(List.of(roleDomainRepository.findByAuthority(role).orElseThrow(() -> new RoleNotFoundException("Role not found"))));
    }

    @Override
    public List<UserDTO> getRCUsersByName(String name) {
        Specification<User> spec= (root, query, cb) -> {
            if (name == null || name.trim().isEmpty()) {
                return cb.conjunction(); // No filtering if name is empty
            }

            Expression<String> fullName = cb.concat(root.get("firstName"), " ");
            fullName = cb.concat(fullName, root.get("lastName"));


            Expression<String> lowerFullName = cb.lower(fullName);


            String searchPattern = "%" + name.trim().toLowerCase() + "%";

            return cb.like(lowerFullName, searchPattern);
        };
        Pageable pageable = PageRequest.of(0, 10);


        Page<User> userPage = userDomainRepository.findAll(spec, pageable);



        return userPage.getContent().stream().map(userMapper::toUserDTO).toList();
    }

    @Override
    public LoginResponseDTO refreshToken(UserPrincipal userPrincipal) {
        User user = userDomainRepository.findById(userPrincipal.userId())
                .orElseThrow(() -> new UserNotFoundException("No user found for the provided credentials."));

        if (user.isDeleted()) throw new UserDisabledException("This account has been disabled. Please contact support for further assistance.");

        return new LoginResponseDTO(
                jwtService.generateAccessToken(user),
                jwtService.generateRefreshToken(user),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles().stream()
                        .map(r -> String.valueOf(r.getAuthority()))
                        .toList()
        );
    }

    /*@Override
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
    }*/

    @Override
    public Boolean recoverPassword(RecoverPasswordDTO recoverPasswordDTO) throws MessagingException {
        User dbUser = userDomainRepository.findByEmail(recoverPasswordDTO.email()).orElseThrow(() -> new UserNotFoundException("User not found with email: " + recoverPasswordDTO.email()));
        String resetPasswordToken = jwtService.generateResetPasswordToken(dbUser);

        String resetUrl = mailUtility.applicationDomainUrl + "/remotesync/reset-password?token=" + resetPasswordToken;
        String subject = "Your RemoteSync Password Reset Request";
        String htmlContent = buildRecoverPasswordEmail(dbUser.getFirstName(), resetUrl);


        mailUtility.sendEmail(dbUser.getEmail(), subject, htmlContent, true);
        return true;
    }

    @Override
    public LoginResponseDTO resetPassword(GlobalDTO globalDTO, ResetPasswordDTO resetPasswordDTO) throws MessagingException {
        if (!resetPasswordDTO.password().equals(resetPasswordDTO.confPassword())) throw new UserNotFoundException("Reset password does not match");

        User dbUser = userDomainRepository.findById(globalDTO.userId())
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + globalDTO.userId()));

        dbUser.setPassword(passwordEncoder.encode(resetPasswordDTO.password()));
        userDomainRepository.save(dbUser);

        String subject = "Your Password Was Changed";
        String htmlContent = buildPasswordChangedConfirmationEmail(dbUser.getFirstName());

        mailUtility.sendEmail(dbUser.getEmail(), subject, htmlContent, true);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dbUser.getUsername(), resetPasswordDTO.password())
        );

        if (!authentication.isAuthenticated()) throw new UserNotFoundException("Authentication failed. Incorrect username/email or password.");

        return new LoginResponseDTO(
                jwtService.generateAccessToken(dbUser),
                jwtService.generateRefreshToken(dbUser),
                dbUser.getFirstName(),
                dbUser.getLastName(),
                dbUser.getRoles().stream()
                        .map(r -> String.valueOf(r.getAuthority()))
                        .toList()
        );
    }

    @Override
    public AssociateProfileDTO associateUpdateProfile(GlobalDTO globalDTO, AssociateUpdateProfileDTO associateUpdateProfileDTO) {
        User dbUser = userDomainRepository.findById(globalDTO.userId()).orElseThrow(() -> new UserNotFoundException("User not found with id: " + globalDTO.userId()));

        dbUser.setFirstName(associateUpdateProfileDTO.firstName());
        dbUser.setLastName(associateUpdateProfileDTO.lastName());
        dbUser.setPhoneNumber(associateUpdateProfileDTO.phoneNumber());

        return userMapper.toAssociateProfileDTO(userDomainRepository.save(dbUser));
    }

    public String buildRecoverPasswordEmail(String name, String resetUrl) {
        return """
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>Reset Your Password</title>
        <!--[if mso]>
        <style>
            table, td, h1, p, a {font-family: Arial, sans-serif !important;}
        </style>
        <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; width: 100%%; background-color: #F3F4F6;">
        <center style="width: 100%%; background-color: #F3F4F6;">
            <!--[if mso | IE]>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="background-color: #ffffff;">
            <tr>
            <td style="padding: 40px;">
            <![endif]-->

            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 600px;">
                    <!-- Logo Header -->
                    <tr>
                        <td style="padding: 32px 40px 24px; text-align: center;">
                            <a href="%s" target="_blank">
                                <img src="%s" alt="%s Logo" width="150" style="border: 0; max-width: 150px; height: auto; display: block; margin: 0 auto;">
                            </a>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
                            <h1 style="font-size: 24px; font-weight: 600; color: #1F2937; margin-top: 0; margin-bottom: 16px;">
                                Password Reset Request
                            </h1>
                            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
                                Hello %s,
                            </p>
                            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px;">
                                We received a request to reset the password for your %s account. You can reset your password by clicking the button below.
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px;">
                                <tr>
                                    <td align="center" bgcolor="#FF6600" style="border-radius: 6px;">
                                        <a href="%s" target="_blank" style="font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; display: inline-block;">
                                            Reset Your Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
                                This link is valid for 15 minutes for your security. If you did not request a password reset, please ignore this email or contact our support if you have concerns.
                            </p>

                            <!-- Fallback Link -->
                            <p style="font-size: 14px; color: #6B7280; line-height: 1.5; margin: 0 0 16px;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <a href="%s" target="_blank" style="color: #FF6600; text-decoration: underline; word-break: break-all;">%s</a>
                            </p>

                            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0;">
                                Thank you,<br>
                                The %s Team
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px;">
                            <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 0 0 16px;">
                            <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 12px; color: #6B7280; text-align: center; line-height: 1.5;">
                                You are receiving this email because a password reset was requested for your account.<br>
                                © %d %s. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>

            <!--[if mso | IE]>
            </td>
            </tr>
            </table>
            <![endif]-->
        </center>
    </body>
    </html>
    """.formatted(
                this.mailUtility.applicationDomainUrl,
                this.mailUtility.applicationLogoUrl,
                this.mailUtility.applicationName,
                name != null ? name : "there",
                this.mailUtility.applicationName,
                resetUrl,
                resetUrl,
                resetUrl,
                this.mailUtility.applicationName,
                java.time.Year.now().getValue(),
                this.mailUtility.applicationName
        );
    }

    private String buildPasswordChangedConfirmationEmail(String name) {
        return """
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <title>Password Changed</title>
        <!--[if mso]>
        <style>
            table, td, h1, p, a {font-family: Arial, sans-serif !important;}
        </style>
        <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; width: 100%%; background-color: #F3F4F6;">
        <center style="width: 100%%; background-color: #F3F4F6;">
            <!--[if mso | IE]>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="background-color: #ffffff;">
            <tr>
            <td style="padding: 40px;">
            <![endif]-->

            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%%" style="max-width: 600px;">
                    <!-- Logo Header -->
                    <tr>
                        <td style="padding: 32px 40px 24px; text-align: center;">
                            <a href="%s" target="_blank">
                                <img src="%s" alt="%s Logo" width="150" style="border: 0; max-width: 150px; height: auto; display: block; margin: 0 auto;">
                            </a>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
                            <h1 style="font-size: 24px; font-weight: 600; color: #1F2937; margin-top: 0; margin-bottom: 16px;">
                                Password Changed Successfully
                            </h1>
                            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
                                Hello %s,
                            </p>
                            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px;">
                                This is a confirmation that the password for your %s account was recently changed. If this was you, you can safely disregard this email.
                            </p>

                            <!-- Security Action Block -->
                            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 24px; border-left: 4px solid #FF6600; padding-left: 16px;">
                                <strong>Didn't make this change?</strong><br>
                                Please <a href="mailto:%s" target="_blank" style="color: #FF6600; font-weight: bold; text-decoration: underline;">contact our support team</a> immediately to secure your account.
                            </p>

                            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0;">
                                Thank you,<br>
                                The %s Team
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px;">
                            <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 0 0 16px;">
                            <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 12px; color: #6B7280; text-align: center; line-height: 1.5;">
                                You are receiving this email as a security notification for your account.<br>
                                © %d %s. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>

            <!--[if mso | IE]>
            </td>
            </tr>
            </table>
            <![endif]-->
        </center>
    </body>
    </html>
    """.formatted(
                this.mailUtility.applicationDomainUrl,
                this.mailUtility.applicationLogoUrl,
                this.mailUtility.applicationName,
                name != null ? name : "there",
                this.mailUtility.applicationName,
                this.mailUtility.applicationSupportEmail,
                this.mailUtility.applicationName,
                java.time.Year.now().getValue(),
                this.mailUtility.applicationName
        );
    }
}
