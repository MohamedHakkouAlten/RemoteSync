package com.alten.remotesync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class RemoteSyncApplication {
	public static void main(String[] args) {
		SpringApplication.run(RemoteSyncApplication.class, args);
	}
}
