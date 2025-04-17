package com.alten.remotesync;

import java.time.LocalDateTime;
import java.util.*;

import com.alten.remotesync.kernel.utilty.RolePrivileges.DefaultRolePrivileges;
import com.alten.remotesync.kernel.utilty.RolePrivileges.DefaultRoles;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.assignedRotation.model.embeddable.AssignedRotationId;
import com.alten.remotesync.domain.assignedRotation.repository.AssignedRotationDomainRepository;
import com.alten.remotesync.domain.client.model.Client;
import com.alten.remotesync.domain.client.repository.ClientDomainRepository;
import com.alten.remotesync.domain.factory.model.Factory;
import com.alten.remotesync.domain.factory.repository.FactoryDomainRepository;
import com.alten.remotesync.domain.log.enumeration.LogStatus;
import com.alten.remotesync.domain.log.model.Log;
import com.alten.remotesync.domain.log.repository.LogDomainRepository;
import com.alten.remotesync.domain.notification.enumeration.NotificationStatus;
import com.alten.remotesync.domain.notification.model.Notification;
import com.alten.remotesync.domain.notification.repository.NotificationDomainRepository;
import com.alten.remotesync.domain.privilege.model.Privilege;
import com.alten.remotesync.domain.privilege.repository.PrivilegeDomainRepository;
import com.alten.remotesync.domain.project.enumeration.ProjectStatus;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;
import com.alten.remotesync.domain.report.enumeration.ReportStatus;
import com.alten.remotesync.domain.report.enumeration.ReportType;
import com.alten.remotesync.domain.report.model.Report;
import com.alten.remotesync.domain.report.repository.ReportDomainRepository;
import com.alten.remotesync.domain.role.model.Role;
import com.alten.remotesync.domain.role.repository.RoleDomainRepository;
import com.alten.remotesync.domain.rotation.model.Rotation;
import com.alten.remotesync.domain.rotation.repository.RotationDomainRepository;
import com.alten.remotesync.domain.subFactory.model.SubFactory;
import com.alten.remotesync.domain.subFactory.repository.SubFactoryDomainRepository;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class RemoteSyncApplication {
    public static void main(String[] args) {
        SpringApplication.run(RemoteSyncApplication.class, args);
    }

    //@Bean
    public CommandLineRunner init(
            AssignedRotationDomainRepository assignedRotationRepository,
            ClientDomainRepository clientRepository,
            FactoryDomainRepository factoryRepository,
            LogDomainRepository logRepository,
            NotificationDomainRepository notificationRepository,
            PrivilegeDomainRepository privilegeRepository,
            ProjectDomainRepository projectRepository,
            ReportDomainRepository reportRepository,
            RoleDomainRepository roleRepository,
            RotationDomainRepository rotationRepository,
            SubFactoryDomainRepository subFactoryRepository,
            UserDomainRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            List<Role> roles = roleRepository.findAll();

//            for (DefaultRoles defaultRole : DefaultRoles.values()) {
//                Set<String> existingAuthorities = new HashSet<>();
//                List<Privilege> privileges = new ArrayList<>();
//
//                for (DefaultRolePrivileges defaultRolePrivilege : defaultRole.defaultRolePrivileges) {
//                    String authority = defaultRolePrivilege.authority;
//
//                    if (!existingAuthorities.contains(authority)) {
//                        Privilege dbPrivilege = Privilege.builder()
//                                .authority(authority)
//                                .build();
//
//                        privileges.add(privilegeRepository.save(dbPrivilege));
//                        existingAuthorities.add(authority);
//                    }
//                }
//
//                Role dbRole = Role.builder()
//                        .authority(defaultRole.name())
//                        .privileges(privileges)
//                        .build();
//
//                roles.add(roleRepository.save(dbRole));
//            }

            // Create Factories
            Factory factory1 = Factory.builder()
                    .label("ALTEN CASABLANCA")
                    .City("Casablanca")
                    .address("123 Industrial Zone, Casablanca")
                    .isDeleted(false)
                    .build();

            Factory factory2 = Factory.builder()
                    .label("ALTEN RABAT")
                    .City("Rabat")
                    .address("456 Tech Park, Rabat")
                    .isDeleted(false)
                    .build();

            Factory factory3 = Factory.builder()
                    .label("ALTEN TANGIER")
                    .City("Tangier")
                    .address("789 Port Area, Tangier")
                    .isDeleted(false)
                    .build();

            Factory factory4 = Factory.builder()
                    .label("ALTEN MARRAKECH")
                    .City("Marrakech")
                    .address("101 Innovation Hub, Marrakech")
                    .isDeleted(false)
                    .build();

            Factory factory5 = Factory.builder()
                    .label("ALTEN AGADIR")
                    .City("Agadir")
                    .address("202 Tech Center, Agadir")
                    .isDeleted(false)
                    .build();

            List<Factory> factories = List.of(factory1, factory2, factory3, factory4, factory5);
            factoryRepository.saveAll(factories);

            // Create SubFactories
            SubFactory subFactory1 = SubFactory.builder()
                    .label("RH")
                    .title("Human Resources")
                    .capacity(30)
                    .factory(factory1)
                    .isDeleted(false)
                    .build();

            SubFactory subFactory2 = SubFactory.builder()
                    .label("DEV")
                    .title("Development")
                    .capacity(50)
                    .factory(factory1)
                    .isDeleted(false)
                    .build();

            SubFactory subFactory3 = SubFactory.builder()
                    .label("CONSULTANT")
                    .title("Consulting")
                    .capacity(40)
                    .factory(factory2)
                    .isDeleted(false)
                    .build();

            SubFactory subFactory4 = SubFactory.builder()
                    .label("QA")
                    .title("Quality Assurance")
                    .capacity(25)
                    .factory(factory2)
                    .isDeleted(false)
                    .build();

            SubFactory subFactory5 = SubFactory.builder()
                    .label("DESIGN")
                    .title("UI/UX Design")
                    .capacity(20)
                    .factory(factory3)
                    .isDeleted(false)
                    .build();

            List<SubFactory> subFactories = List.of(subFactory1, subFactory2, subFactory3, subFactory4, subFactory5);
            subFactoryRepository.saveAll(subFactories);

            // Create Users
            User adminUser = User.builder()
                    .firstName("Maryam")
                    .lastName("Alaoui Ismaili")
                    .email("maryam.alaoui@remotesync.com")
                    .username("maryamalaouiismaili")
                    .password(passwordEncoder.encode("admin123"))
                    .reference(1001L)
                    .phoneNumber("+212600000001")
                    .roles(List.of(roles.get(0)))
                    .isDeleted(false)
                    .subFactory(subFactory1)
                    .build();

            User managerUser = User.builder()
                    .firstName("Hamza")
                    .lastName("Jdaidi")
                    .email("hamza.jdaidi@remotesync.com")
                    .username("hamzajdaidi")
                    .password(passwordEncoder.encode("manager123"))
                    .reference(1002L)
                    .phoneNumber("+212600000002")
                    .roles(List.of(roles.get(1)))
                    .isDeleted(false)
                    .subFactory(subFactory1)
                    .build();

            User normalUser1 = User.builder()
                    .firstName("Ahmed")
                    .lastName("El Amrani")
                    .email("ahmed.elamrani@remotesync.com")
                    .username("ahmedelamrani")
                    .password(passwordEncoder.encode("user123"))
                    .reference(1003L)
                    .phoneNumber("+212600000003")
                    .roles(List.of(roles.get(2)))
                    .isDeleted(false)
                    .subFactory(subFactory2)
                    .build();

            User clientUser = User.builder()
                    .firstName("Sofia")
                    .lastName("Bensalah")
                    .email("sofia.bensalah@remotesync.com")
                    .username("sofiabensalah")
                    .password(passwordEncoder.encode("user123"))
                    .reference(1004L)
                    .phoneNumber("+212600000004")
                    .roles(List.of(roles.get(2)))
                    .isDeleted(false)
                    .subFactory(subFactory3)
                    .build();

            User techUser = User.builder()
                    .firstName("Ahmed")
                    .lastName("Mohssin")
                    .email("ahmed.mohssin@remotesync.com")
                    .username("ahmedmohssin")
                    .password(passwordEncoder.encode("tech123"))
                    .reference(1005L)
                    .phoneNumber("+212600000005")
                    .roles(List.of(roles.get(2)))
                    .isDeleted(false)
                    .subFactory(subFactory4)
                    .build();

            User normalUser2 = User.builder()
                    .firstName("Mohamed")
                    .lastName("Hakkou")
                    .email("mohamed.hakkou@remotesync.com")
                    .username("mohamedhakkou")
                    .password(passwordEncoder.encode("client123"))
                    .reference(1006L)
                    .phoneNumber("+212600000006")
                    .roles(List.of(roles.get(2)))
                    .isDeleted(false)
                    .subFactory(subFactory5)
                    .build();

            List<User> users = List.of(adminUser, managerUser, normalUser1, normalUser2, techUser, clientUser);
            userRepository.saveAll(users);

            // Create Clients
            Client client1 = Client.builder()
                    .label("TC")
                    .ICE("ICE123456789")
                    .address("123 Tech Street, Casablanca")
                    .email("contact@tc.com")
                    .name("TC Solutions")
                    .sector("Information Technology")
                    .isDeleted(false)
                    .build();

            Client client2 = Client.builder()
                    .label("FG")
                    .ICE("ICE12345678900")
                    .address("456 Finance Avenue, Rabat")
                    .email("info@fg.com")
                    .name("FG International")
                    .sector("Banking & Finance")
                    .isDeleted(false)
                    .build();

            Client client3 = Client.builder()
                    .label("TL")
                    .ICE("ICE1234567890000")
                    .address("789 Transport Boulevard, Marrakech")
                    .email("support@tl.com")
                    .name("TL Solutions")
                    .sector("TRANSPORT")
                    .isDeleted(false)
                    .build();

            Client client4 = Client.builder()
                    .label("ET")
                    .ICE("ICE0000123456789")
                    .address("101 Education Road, Tangier")
                    .email("info@et.com")
                    .name("ET")
                    .sector("Education")
                    .isDeleted(false)
                    .build();

            Client client5 = Client.builder()
                    .label("RC")
                    .ICE("IC000E123456789")
                    .address("202 Retail Street, Agadir")
                    .email("sales@rc.com")
                    .name("RC")
                    .sector("Retail")
                    .isDeleted(false)
                    .build();

            List<Client> clients = List.of(client1, client2, client3, client4, client5);
            clientRepository.saveAll(clients);

            // Create Projects
            Project project1 = Project.builder()
                    .label("CRM System")
                    .titre("Customer Relationship Management System")
                    .status(ProjectStatus.ACTIVE)
                    .deadLine(LocalDateTime.now().plusDays(90)) // 90 days from now
                    .isDeleted(false)
                    .owner(client1)
                    .build();

            Project project2 = Project.builder()
                    .label("Mobile Banking App")
                    .titre("Next-Gen Mobile Banking Application")
                    .status(ProjectStatus.ACTIVE)
                    .deadLine(LocalDateTime.now().plusDays(120)) // 120 days from now
                    .isDeleted(false)
                    .owner(client2)
                    .build();

            Project project3 = Project.builder()
                    .label("Patient Portal")
                    .titre("Online Patient Management Portal")
                    .status(ProjectStatus.PENDING)
                    .deadLine(LocalDateTime.now().plusDays(60)) // 60 days from now
                    .isDeleted(false)
                    .owner(client3)
                    .build();

            Project project4 = Project.builder()
                    .label("E-Learning Platform")
                    .titre("Interactive E-Learning Platform")
                    .status(ProjectStatus.COMPLETED)
                    .deadLine(LocalDateTime.now().plusDays(30)) // 30 days ago
                    .isDeleted(false)
                    .owner(client4)
                    .build();

            Project project5 = Project.builder()
                    .label("Inventory Management")
                    .titre("Retail Inventory Management System")
                    .status(ProjectStatus.INACTIVE)
                    .deadLine(LocalDateTime.now().plusDays(45)) // 45 days from now
                    .isDeleted(false)
                    .owner(client5)
                    .build();

            Project project6 = Project.builder()
                    .label("Analytics Dashboard")
                    .titre("Business Intelligence Analytics Dashboard")
                    .status(ProjectStatus.ACTIVE)
                    .deadLine(LocalDateTime.now().plusDays(75)) // 75 days from now
                    .isDeleted(false)
                    .owner(client1)
                    .build();

            List<Project> projects = List.of(project1, project2, project3, project4, project5, project6);
            projectRepository.saveAll(projects);

            // Create Rotations
            Rotation rotation1 = Rotation.builder()
                    .name("Sprint 1")
                    .startDate(new Date(System.currentTimeMillis() - 15 * 24 * 60 * 60 * 1000L)) // 15 days ago
                    .endDate(new Date(System.currentTimeMillis() + 15 * 24 * 60 * 60 * 1000L)) // 15 days from now
                    .rotationSequence(1)
                    .customDates(List.of(
                            new Date(),
                            new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000L),
                            new Date(System.currentTimeMillis() + 10 * 24 * 60 * 60 * 1000L)
                    ))
                    .build();

            Rotation rotation2 = Rotation.builder()
                    .name("Sprint 2")
                    .startDate(new Date(System.currentTimeMillis() + 16 * 24 * 60 * 60 * 1000L)) // 16 days from now
                    .endDate(new Date(System.currentTimeMillis() + 30 * 24 * 60 * 60 * 1000L)) // 30 days from now
                    .rotationSequence(2)
                    .build(); // Simple rotation with just start and end dates

            Rotation rotation3 = Rotation.builder()
                    .name("Sprint 3")
                    .startDate(new Date(System.currentTimeMillis() + 31 * 24 * 60 * 60 * 1000L)) // 31 days from now
                    .endDate(new Date(System.currentTimeMillis() + 45 * 24 * 60 * 60 * 1000L)) // 45 days from now
                    .rotationSequence(3)
                    .customDates(List.of(new Date(System.currentTimeMillis() + 35 * 24 * 60 * 60 * 1000L)))
                    .build();

            Rotation rotation4 = Rotation.builder()
                    .name("Sprint 4")
                    .startDate(new Date(System.currentTimeMillis() + 46 * 24 * 60 * 60 * 1000L)) // 46 days from now
                    .endDate(new Date(System.currentTimeMillis() + 60 * 24 * 60 * 60 * 1000L)) // 60 days from now
                    .rotationSequence(4)
                    .customDates(List.of(new Date(System.currentTimeMillis() + 50 * 24 * 60 * 60 * 1000L)))
                    .build();

            Rotation rotation5 = Rotation.builder()
                    .name("Sprint 5")
                    .startDate(new Date(System.currentTimeMillis() + 61 * 24 * 60 * 60 * 1000L)) // 61 days from now
                    .endDate(new Date(System.currentTimeMillis() + 75 * 24 * 60 * 60 * 1000L)) // 75 days from now
                    .rotationSequence(5)
                    .customDates(List.of(new Date(System.currentTimeMillis() + 65 * 24 * 60 * 60 * 1000L)))
                    .build();

            List<Rotation> rotations = List.of(rotation1, rotation2, rotation3, rotation4, rotation5);
            rotationRepository.saveAll(rotations);

            // Create AssignedRotations
            // Active rotation for normalUser1
            AssignedRotation assignedRotation1 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(normalUser1.getUserId(), rotation1.getRotationId()))
                    .user(normalUser1)
                    .rotation(rotation1)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(project2)
                    .createdBy(adminUser)
                    .build();

            // Overridden rotation for normalUser1
            AssignedRotation assignedRotation2 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(normalUser1.getUserId(), rotation2.getRotationId()))
                    .user(normalUser1)
                    .rotation(rotation2)
                    .rotationAssignmentStatus(RotationAssignmentStatus.OVERRIDDEN)
                    .overrideDate(new Date())
                    .createdBy(adminUser)
                    .build();

            // Active rotation for normalUser2
            AssignedRotation assignedRotation3 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(normalUser2.getUserId(), rotation1.getRotationId()))
                    .user(normalUser2)
                    .rotation(rotation1)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(project6)
                    .createdBy(managerUser)
                    .build();

            // Overridden rotation for normalUser2
            AssignedRotation assignedRotation4 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(normalUser2.getUserId(), rotation2.getRotationId()))
                    .user(normalUser2)
                    .rotation(rotation2)
                    .rotationAssignmentStatus(RotationAssignmentStatus.OVERRIDDEN)
                    .overrideDate(new Date())
                    .createdBy(managerUser)
                    .build();

            // Active rotation for techUser with custom dates
            AssignedRotation assignedRotation5 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(techUser.getUserId(), rotation1.getRotationId()))
                    .user(techUser)
                    .rotation(rotation1)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(project3)
                    .createdBy(adminUser)
                    .build();

            List<AssignedRotation> assignedRotations = List.of(assignedRotation1, assignedRotation2, assignedRotation3, assignedRotation4, assignedRotation5);
            assignedRotationRepository.saveAll(assignedRotations);

            // Create Logs
            Log log1 = Log.builder()
                    .entityId(normalUser1.getUserId())
                    .ipAddress("192.168.1.1")
                    .actionType("LOGIN")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .entityType("USER")
                    .actionDetails("User login successful")
                    .user(normalUser1)
                    .build();

            Log log2 = Log.builder()
                    .entityId(project1.getProjectId())
                    .ipAddress("192.168.1.2")
                    .actionType("CREATE")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .entityType("PROJECT")
                    .actionDetails("Project created successfully")
                    .user(adminUser)
                    .build();

            Log log3 = Log.builder()
                    .entityId(rotation1.getRotationId())
                    .ipAddress("192.168.1.3")
                    .actionType("UPDATE")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")
                    .entityType("ROTATION")
                    .actionDetails("Rotation updated successfully")
                    .user(managerUser)
                    .build();

            Log log4 = Log.builder()
                    .entityId(client1.getClientId())
                    .ipAddress("192.168.1.4")
                    .actionType("DELETE")
                    .status(LogStatus.FAILURE)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .entityType("CLIENT")
                    .actionDetails("Insufficient permissions to delete client")
                    .user(normalUser2)
                    .build();

            Log log5 = Log.builder()
                    .entityId(assignedRotation1.getAssignedRotationId().getUserId())
                    .ipAddress("192.168.1.5")
                    .actionType("ASSIGN")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .entityType("ASSIGNED_ROTATION")
                    .actionDetails("User assigned to rotation successfully")
                    .user(adminUser)
                    .build();

            List<Log> logs = List.of(log1, log2, log3, log4, log5);
            logRepository.saveAll(logs);

            // Create Notifications
            Notification notification1 = Notification.builder()
                    .title("Welcome to RemoteSync")
                    .description("Welcome to the RemoteSync platform. Get started by exploring your dashboard.")
                    .status(NotificationStatus.NORMAL)
                    .receiver(normalUser1)
                    .build();

            Notification notification2 = Notification.builder()
                    .title("New Rotation Assignment")
                    .description("You have been assigned to a new rotation. Please check your schedule.")
                    .status(NotificationStatus.IMPORTANT)
                    .receiver(normalUser2)
                    .build();

            Notification notification3 = Notification.builder()
                    .title("Project Deadline Approaching")
                    .description("The deadline for project 'CRM System' is approaching. Please ensure all tasks are completed.")
                    .status(NotificationStatus.ALERT)
                    .receiver(techUser)
                    .build();

            Notification notification4 = Notification.builder()
                    .title("Rotation Override Request")
                    .description("Your request to override rotation has been approved.")
                    .status(NotificationStatus.INFO)
                    .receiver(normalUser2)
                    .build();

            Notification notification5 = Notification.builder()
                    .title("System Maintenance")
                    .description("The system will undergo maintenance on Saturday night. Please save your work.")
                    .status(NotificationStatus.URGENT)
                    .receiver(adminUser)
                    .build();

            List<Notification> notifications = List.of(notification1, notification2, notification3, notification4, notification5);
            notificationRepository.saveAll(notifications);

            // Create Reports
            Report report1 = Report.builder()
                    .title("Rotation Request")
                    .reason("Need to change rotation due to personal reasons")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.PENDING)
                    .description("I need to change my rotation schedule due to a family emergency.")
                    .createdBy(normalUser1)
                    .build();

            Report report2 = Report.builder()
                    .title("Rotation Request")
                    .reason("Project requirements changed")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.ACCEPTED)
                    .description("The project requirements have changed, and I need to adjust my rotation schedule.")
                    .createdBy(normalUser2)
                    .updatedBy(adminUser)
                    .build();

            Report report3 = Report.builder()
                    .title("Rotation Request")
                    .reason("Conflicting schedules")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.REJECTED)
                    .description("I have conflicting schedules and need to change my rotation.")
                    .createdBy(techUser)
                    .updatedBy(managerUser)
                    .build();

            Report report4 = Report.builder()
                    .title("Rotation Request")
                    .reason("Technical training")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.OPENED)
                    .description("I need to attend a technical training during my scheduled rotation.")
                    .createdBy(normalUser1)
                    .build();

            Report report5 = Report.builder()
                    .title("Rotation Request")
                    .reason("Health issues")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.PENDING)
                    .description("Due to health issues, I need to reschedule my rotation.")
                    .createdBy(normalUser2)
                    .build();

            List<Report> reports = List.of(report1, report2, report3, report4, report5);
            reportRepository.saveAll(reports);
        };
    }
}
