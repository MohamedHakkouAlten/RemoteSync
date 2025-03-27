package com.alten.remotesync;

import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class RemoteSyncApplication {
    public static void main(String[] args) {
        SpringApplication.run(RemoteSyncApplication.class, args);
    }


}
