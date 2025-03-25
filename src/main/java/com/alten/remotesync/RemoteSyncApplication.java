package com.alten.remotesync;

import com.alten.remotesync.domain.privilege.model.Privilege;
import com.alten.remotesync.domain.privilege.repository.PrivilegeDomainRepository;
import com.alten.remotesync.domain.role.model.Role;
import com.alten.remotesync.domain.role.repository.RoleDomainRepository;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import com.alten.remotesync.kernel.security.jwt.JwtService;
import com.alten.remotesync.kernel.utilty.RolePrivileges.DefaultRolePrivileges;
import com.alten.remotesync.kernel.utilty.RolePrivileges.DefaultRoles;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })

public class RemoteSyncApplication  {




	public static void main(String[] args) {
		SpringApplication.run(RemoteSyncApplication.class, args);
	}

	@Bean
	CommandLineRunner init(
			UserDomainRepository userDomainRepository,
			RoleDomainRepository roleDomainRepository,
			PrivilegeDomainRepository privilegeDomainRepository,
			PasswordEncoder passwordEncoder,
			JwtService jwtService) {

		return args -> {
			// INSERTING ROLES AND THEIR PRIVILEGES
			for (DefaultRoles defaultRole : DefaultRoles.values()) {

				List<Privilege> privileges = new ArrayList<>();

				for (DefaultRolePrivileges defaultRolePrivilege : defaultRole.defaultRolePrivileges) {
					// Save each privilege and add to the list
					Privilege privilege = privilegeDomainRepository.save(
							Privilege.builder()
									.authority(defaultRolePrivilege.getAuthority())  // Use getter method
									.build()
					);
					privileges.add(privilege);
				}

				// Save the role with associated privileges
				roleDomainRepository.save(
						Role.builder()
								.authority(defaultRole.name())
								.privileges(privileges)
								.build()
				);
			}
		};
	}

}
