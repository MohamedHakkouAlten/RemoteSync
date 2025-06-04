package com.alten.remotesync;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.alten.remotesync.domain.customDate.model.CustomDate;
import com.alten.remotesync.domain.rotation.enumeration.RotationStatus;
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

            for (DefaultRoles defaultRole : DefaultRoles.values()) {
                Set<String> existingAuthorities = new HashSet<>();
                List<Privilege> privileges = new ArrayList<>();

                for (DefaultRolePrivileges defaultRolePrivilege : defaultRole.defaultRolePrivileges) {
                    String authority = defaultRolePrivilege.authority;

                    if (!existingAuthorities.contains(authority)) {
                        Privilege dbPrivilege = Privilege.builder()
                                .authority(authority)
                                .build();

                        privileges.add(privilegeRepository.save(dbPrivilege));
                        existingAuthorities.add(authority);
                    }
                }

                Role dbRole = Role.builder()
                        .authority(defaultRole.name())
                        .privileges(privileges)
                        .build();

                roles.add(roleRepository.save(dbRole));
            }

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

            // Create Users - only keeping the specified three accounts
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

            User normalUser = User.builder()
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

            List<User> users = List.of(adminUser, managerUser, normalUser);
            userRepository.saveAll(users);

            // Create Clients - adding more entries (10 total)
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
                    .name("ET Educational Systems")
                    .sector("Education")
                    .isDeleted(false)
                    .build();

            Client client5 = Client.builder()
                    .label("RC")
                    .ICE("IC000E123456789")
                    .address("202 Retail Street, Agadir")
                    .email("sales@rc.com")
                    .name("RC Retail Chain")
                    .sector("Retail")
                    .isDeleted(false)
                    .build();
                    
            Client client6 = Client.builder()
                    .label("HC")
                    .ICE("ICE987654321")
                    .address("505 Health Boulevard, Fez")
                    .email("info@hc.com")
                    .name("HC Health Systems")
                    .sector("Healthcare")
                    .isDeleted(false)
                    .build();
                    
            Client client7 = Client.builder()
                    .label("MS")
                    .ICE("ICE567891234")
                    .address("707 Manufacturing Lane, Tangier")
                    .email("contact@ms.com")
                    .name("MS Manufacturing Solutions")
                    .sector("Manufacturing")
                    .isDeleted(false)
                    .build();
                    
            Client client8 = Client.builder()
                    .label("TS")
                    .ICE("ICE112233445")
                    .address("909 Tourism Avenue, Marrakech")
                    .email("info@ts.com")
                    .name("TS Tourism Services")
                    .sector("Tourism")
                    .isDeleted(false)
                    .build();
                    
            Client client9 = Client.builder()
                    .label("ES")
                    .ICE("ICE998877665")
                    .address("111 Energy Plaza, Casablanca")
                    .email("contact@es.com")
                    .name("ES Energy Solutions")
                    .sector("Energy")
                    .isDeleted(false)
                    .build();
                    
            Client client10 = Client.builder()
                    .label("LP")
                    .ICE("ICE556677889")
                    .address("222 Legal Street, Rabat")
                    .email("info@lp.com")
                    .name("LP Legal Partners")
                    .sector("Legal Services")
                    .isDeleted(false)
                    .build();

            List<Client> clients = List.of(client1, client2, client3, client4, client5, client6, client7, client8, client9, client10);
            clientRepository.saveAll(clients);

            // Create Projects - adding more entries (10 total)
            Project project1 = Project.builder()
                    .label("Customer Relationship Management System")
                    .status(ProjectStatus.ACTIVE)
                    .startDate(LocalDate.now())
                    .deadLine(LocalDate.now().plusDays(90)) // 90 days from now
                    .isDeleted(false)
                    .owner(client1)
                    .build();

            Project project2 = Project.builder()
                    .label("Next-Gen Mobile Banking Application")
                    .status(ProjectStatus.ACTIVE)
                    .startDate(LocalDate.now())
                    .deadLine(LocalDate.now().plusDays(120)) // 120 days from now
                    .isDeleted(false)
                    .owner(client2)
                    .build();

            Project project3 = Project.builder()
                    .label("Online Patient Management Portal")
                    .status(ProjectStatus.ACTIVE)
                    .startDate(LocalDate.now())
                    .deadLine(LocalDate.now().plusDays(60)) // 60 days from now
                    .isDeleted(false)
                    .owner(client3)
                    .build();

            Project project4 = Project.builder()
                    .label("Interactive E-Learning Platform")
                    .status(ProjectStatus.COMPLETED)
                    .startDate(LocalDate.now())
                    .deadLine(LocalDate.now().plusDays(30)) // 30 days from now
                    .isDeleted(false)
                    .owner(client4)
                    .build();

            Project project5 = Project.builder()
                    .label("Retail Inventory Management System")
                    .status(ProjectStatus.INACTIVE)
                    .startDate(LocalDate.now())
                    .deadLine(LocalDate.now().plusDays(45)) // 45 days from now
                    .isDeleted(false)
                    .owner(client5)
                    .build();

            Project project6 = Project.builder()
                    .label("Business Intelligence Analytics Dashboard")
                    .status(ProjectStatus.ACTIVE)
                    .startDate(LocalDate.now())
                    .deadLine(LocalDate.now().plusDays(75)) // 75 days from now
                    .isDeleted(false)
                    .owner(client1)
                    .build();
                    
            Project project7 = Project.builder()
                    .label("Mobile Healthcare Application")
                    .status(ProjectStatus.ACTIVE)
                    .startDate(LocalDate.now())
                    .deadLine(LocalDate.now().plusDays(110)) // 110 days from now
                    .isDeleted(false)
                    .owner(client6)
                    .build();
                    
            Project project8 = Project.builder()
                    .label("Manufacturing Supply Chain Management System")
                    .status(ProjectStatus.INACTIVE)
                    .startDate(LocalDate.now())
                    .deadLine(LocalDate.now().plusDays(150)) // 150 days from now
                    .isDeleted(false)
                    .owner(client7)
                    .build();
                    
            Project project9 = Project.builder()
                    .label("Tourism Booking and Reservation Platform")
                    .status(ProjectStatus.ACTIVE)
                    .startDate(LocalDate.now())
                    .deadLine(LocalDate.now().plusDays(180)) // 180 days from now
                    .isDeleted(false)
                    .owner(client8)
                    .build();
                    
            Project project10 = Project.builder()
                    .label("Energy Consumption Analysis Platform")
                    .status(ProjectStatus.ACTIVE)
                    .startDate(LocalDate.now())
                    .deadLine(LocalDate.now().plusDays(200)) // 200 days from now
                    .isDeleted(false)
                    .owner(client9)
                    .build();
                    
            List<Project> projects = List.of(project1, project2, project3, project4, project5, project6, project7, project8, project9, project10);
            projectRepository.saveAll(projects);

            LocalDate now = LocalDate.now(); // Assume it's a Monday for easier calc
            LocalDate monday = now.with(DayOfWeek.MONDAY);

// USER 1 – Custom says ONSITE on Mon, Tue
            Map<LocalDate, RotationStatus> custom1 = Map.of(
                    monday, RotationStatus.ONSITE,
                    monday.plusDays(1), RotationStatus.ONSITE
            );

            Rotation rotation1 = Rotation.builder()
                    .name("User 1")
                    .startDate(monday.minusWeeks(2)) // 2 weeks ago
                    .endDate(monday.plusWeeks(2))    // 2 weeks ahead
                    .cycleLengthWeeks(3)
                    .remoteWeeksPerCycle(2)
                    .build();

            rotation1.setCustomDates(
                    custom1.entrySet().stream()
                            .map(e -> CustomDate.builder().date(e.getKey()).rotationStatus(e.getValue()).build())
                            .collect(Collectors.toList())
            );

// USER 2 – No custom overrides, relies on logic (weekIndex % 3 >= 2) → true only if in 3rd week
            Rotation rotation2 = Rotation.builder()
                    .name("User 2")
                    .startDate(monday.minusWeeks(5)) // 5 weeks ago
                    .endDate(monday.plusWeeks(1))
                    .cycleLengthWeeks(3)
                    .remoteWeeksPerCycle(2)
                    .build();

// USER 3 – Custom override says REMOTE
            Map<LocalDate, RotationStatus> custom3 = Map.of(
                    monday, RotationStatus.REMOTE,
                    monday.plusDays(1), RotationStatus.REMOTE
            );

            Rotation rotation3 = Rotation.builder()
                    .name("User 3")
                    .startDate(monday.minusWeeks(1))
                    .endDate(monday.plusWeeks(1))
                    .cycleLengthWeeks(2)
                    .remoteWeeksPerCycle(1)
                    .build();

            rotation3.setCustomDates(
                    custom3.entrySet().stream()
                            .map(e -> CustomDate.builder().date(e.getKey()).rotationStatus(e.getValue()).build())
                            .collect(Collectors.toList())
            );

// USER 4 – No custom override, weekIndex % 2 >= 1 → week 3 → onsite
            Rotation rotation4 = Rotation.builder()
                    .name("User 4")
                    .startDate(monday.minusWeeks(3)) // Week index = 3
                    .endDate(monday.plusWeeks(1))
                    .cycleLengthWeeks(2)
                    .remoteWeeksPerCycle(1)
                    .build();

//            Rotation rotation2 = Rotation.builder()
//                    .name("Sprint 2")
//                    .startDate(now.plusDays(16))
//                    .endDate(now.plusDays(30))
//                    .cycleLengthWeeks(4)
//                    .remoteWeeksPerCycle(3)
//                    .build();
//
//            HashMap<LocalDate, RotationStatus> rotationsHM2 = new HashMap<>();
//            rotationsHM2.put(now.plusDays(19), RotationStatus.ONSITE);
//            rotationsHM2.put(now.plusDays(19), RotationStatus.ONSITE);
//            rotationsHM2.put(now.plusDays(19), RotationStatus.ONSITE);
//            rotationsHM2.put(now.plusDays(19), RotationStatus.ONSITE);
//
//            Rotation rotation3 = Rotation.builder()
//                    .name("Sprint 3")
//                    .startDate(now.plusDays(1))
//                    .endDate(now.plusDays(1))
//                    .cycleLengthWeeks(4)
//                    .remoteWeeksPerCycle(2)
//                    .build();
//
//            rotation2.setCustomDates(new ArrayList<>());
//
//            for (Map.Entry<LocalDate, RotationStatus> entry : rotationsHM2.entrySet()) {
//                LocalDate date = entry.getKey();
//                RotationStatus status = entry.getValue();
//                rotation2.getCustomDates().add(CustomDate.builder()
//                        .date(date)
//                        .rotationStatus(status)
//                        .build());
//            }
//
//            HashMap<LocalDate, RotationStatus> rotationsHM3 = new HashMap<>();
//            rotationsHM3.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM3.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM3.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM3.put(now.plusDays(1), RotationStatus.ONSITE);
//
//            Rotation rotation4 = Rotation.builder()
//                    .name("Sprint 4")
//                    .startDate(now.plusDays(46))
//                    .endDate(now.plusDays(60))
//                    .cycleLengthWeeks(3)
//                    .remoteWeeksPerCycle(1)
//                    .build();
//
//            rotation3.setCustomDates(new ArrayList<>());
//
//            for (Map.Entry<LocalDate, RotationStatus> entry : rotationsHM3.entrySet()) {
//                LocalDate date = entry.getKey();
//                RotationStatus status = entry.getValue();
//                rotation3.getCustomDates().add(CustomDate.builder()
//                        .date(date)
//                        .rotationStatus(status)
//                        .build());
//            }
//
//            HashMap<LocalDate, RotationStatus> rotationsHM4 = new HashMap<>();
//            rotationsHM4.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM4.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM4.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM4.put(now.plusDays(1), RotationStatus.ONSITE);
//
//            Rotation rotation5 = Rotation.builder()
//                    .name("Sprint 5")
//                    .startDate(now.plusDays(61))
//                    .endDate(now.plusDays(75))
//                    .cycleLengthWeeks(5)
//                    .remoteWeeksPerCycle(2)
//                    .build();
//
//            rotation4.setCustomDates(new ArrayList<>());
//
//            for (Map.Entry<LocalDate, RotationStatus> entry : rotationsHM4.entrySet()) {
//                LocalDate date = entry.getKey();
//                RotationStatus status = entry.getValue();
//                rotation4.getCustomDates().add(CustomDate.builder()
//                        .date(date)
//                        .rotationStatus(status)
//                        .build());
//            }
//
//            HashMap<LocalDate, RotationStatus> rotationsHM5 = new HashMap<>();
//            rotationsHM5.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM5.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM5.put(now.plusDays(1), RotationStatus.ONSITE);
//
//            Rotation rotation6 = Rotation.builder()
//                    .name("Sprint 6")
//                    .startDate(now.plusDays(76))
//                    .endDate(now.plusDays(90))
//                    .cycleLengthWeeks(4)
//                    .remoteWeeksPerCycle(1)
//                    .build();
//
//            rotation5.setCustomDates(new ArrayList<>());
//
//            for (Map.Entry<LocalDate, RotationStatus> entry : rotationsHM5.entrySet()) {
//                LocalDate date = entry.getKey();
//                RotationStatus status = entry.getValue();
//                rotation5.getCustomDates().add(CustomDate.builder()
//                        .date(date)
//                        .rotationStatus(status)
//                        .build());
//            }
//
//            HashMap<LocalDate, RotationStatus> rotationsHM6 = new HashMap<>();
//            rotationsHM6.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM6.put(now.plusDays(1), RotationStatus.ONSITE);
//
//            Rotation rotation7 = Rotation.builder()
//                    .name("Sprint 7")
//                    .startDate(now.plusDays(91))
//                    .endDate(now.plusDays(105))
//                    .cycleLengthWeeks(3)
//                    .remoteWeeksPerCycle(2)
//                    .build();
//
//            rotation6.setCustomDates(new ArrayList<>());
//
//            for (Map.Entry<LocalDate, RotationStatus> entry : rotationsHM6.entrySet()) {
//                LocalDate date = entry.getKey();
//                RotationStatus status = entry.getValue();
//                rotation6.getCustomDates().add(CustomDate.builder()
//                        .date(date)
//                        .rotationStatus(status)
//                        .build());
//            }
//
//            HashMap<LocalDate, RotationStatus> rotationsHM7 = new HashMap<>();
//            rotationsHM7.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM7.put(now.plusDays(1), RotationStatus.ONSITE);
//
//            Rotation rotation8 = Rotation.builder()
//                    .name("Sprint 8")
//                    .startDate(now.plusDays(106))
//                    .endDate(now.plusDays(120))
//                    .cycleLengthWeeks(3)
//                    .remoteWeeksPerCycle(1)
//                    .build();
//
//            rotation7.setCustomDates(new ArrayList<>());
//
//            for (Map.Entry<LocalDate, RotationStatus> entry : rotationsHM7.entrySet()) {
//                LocalDate date = entry.getKey();
//                RotationStatus status = entry.getValue();
//                rotation7.getCustomDates().add(CustomDate.builder()
//                        .date(date)
//                        .rotationStatus(status)
//                        .build());
//            }
//
//            HashMap<LocalDate, RotationStatus> rotationsHM8 = new HashMap<>();
//            rotationsHM8.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM8.put(now.plusDays(1), RotationStatus.ONSITE);
//
//            Rotation rotation9 = Rotation.builder()
//                    .name("Sprint 9")
//                    .startDate(now.plusDays(121))
//                    .endDate(now.plusDays(135))
//                    .cycleLengthWeeks(2)
//                    .remoteWeeksPerCycle(1)
//                    .build();
//
//            rotation8.setCustomDates(new ArrayList<>());
//
//            for (Map.Entry<LocalDate, RotationStatus> entry : rotationsHM8.entrySet()) {
//                LocalDate date = entry.getKey();
//                RotationStatus status = entry.getValue();
//                rotation8.getCustomDates().add(CustomDate.builder()
//                        .date(date)
//                        .rotationStatus(status)
//                        .build());
//            }
//
//            HashMap<LocalDate, RotationStatus> rotationsHM9 = new HashMap<>();
//            rotationsHM9.put(now.plusDays(1), RotationStatus.ONSITE);
//            rotationsHM9.put(now.plusDays(1), RotationStatus.ONSITE);
//
//            Rotation rotation10 = Rotation.builder()
//                    .name("Sprint 10")
//                    .startDate(now.plusDays(136))
//                    .endDate(now.plusDays(150))
//                    .cycleLengthWeeks(4)
//                    .remoteWeeksPerCycle(2)
//                    .build();
//
//            rotation9.setCustomDates(new ArrayList<>());
//
//            for (Map.Entry<LocalDate, RotationStatus> entry : rotationsHM9.entrySet()) {
//                LocalDate date = entry.getKey();
//                RotationStatus status = entry.getValue();
//                rotation9.getCustomDates().add(CustomDate.builder()
//                        .date(date)
//                        .rotationStatus(status)
//                        .build());
//            }

            List<Rotation> rotations = List.of(
                    rotation1, rotation2, rotation3, rotation4
            );

            rotationRepository.saveAll(rotations);

            AssignedRotation assignedRotation1 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(adminUser.getUserId(), rotation1.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation1)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(project1)
                    .createdBy(adminUser)
                    .build();

            AssignedRotation assignedRotation2 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(adminUser.getUserId(), rotation2.getRotationId()))
                    .user(normalUser)
                    .rotation(rotation2)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(project1)
                    .createdBy(adminUser)
                    .build();

            AssignedRotation assignedRotation3 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(adminUser.getUserId(), rotation3.getRotationId()))
                    .user(adminUser)
                    .rotation(rotation3)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(project1)
                    .createdBy(adminUser)
                    .build();

            AssignedRotation assignedRotation4 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(adminUser.getUserId(), rotation4.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation4)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(project1)
                    .createdBy(adminUser)
                    .build();

            // Create AssignedRotations with logical data for our three users (10 total entries)
            /* Active rotation for adminUser
            AssignedRotation assignedRotation1 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(adminUser.getUserId(), rotation1.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation1)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(project1)
                    .createdBy(adminUser)
                    .build();

            // Overridden rotation for adminUser
            AssignedRotation assignedRotation2 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(adminUser.getUserId(), rotation2.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation2)
                    .rotationAssignmentStatus(RotationAssignmentStatus.OVERRIDDEN)
                    .overrideDate(new Date())
                    .createdBy(adminUser)
                    .build();
                    
            // Future rotation for adminUser
            AssignedRotation assignedRotation3 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(adminUser.getUserId(), rotation6.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation6)
                    .rotationAssignmentStatus(RotationAssignmentStatus.PENDING)
                    .project(project7)
                    .createdBy(adminUser)
                    .build();

            // Active rotation for managerUser
            AssignedRotation assignedRotation4 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation1.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation1)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(project2)
                    .createdBy(adminUser)
                    .build();

            // Future rotation for managerUser
            AssignedRotation assignedRotation5 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation3.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation3)
                    .rotationAssignmentStatus(RotationAssignmentStatus.PENDING)
                    .project(project3)
                    .createdBy(adminUser)
                    .build();
                    
            // Additional future rotation for managerUser
            AssignedRotation assignedRotation6 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation7.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation7)
                    .rotationAssignmentStatus(RotationAssignmentStatus.PENDING)
                    .project(project8)
                    .createdBy(adminUser)
                    .build();

            // Active rotation for normalUser
            AssignedRotation assignedRotation7 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(normalUser.getUserId(), rotation1.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation1)
                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                    .project(project6)
                    .createdBy(managerUser)
                    .build();
            
            // Overridden rotation for normalUser
            AssignedRotation assignedRotation8 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(normalUser.getUserId(), rotation2.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation2)
                    .rotationAssignmentStatus(RotationAssignmentStatus.OVERRIDDEN)
                    .overrideDate(new Date())
                    .createdBy(managerUser)
                    .build();

            // Future rotation for normalUser
            AssignedRotation assignedRotation9 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(normalUser.getUserId(), rotation4.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation4)
                    .rotationAssignmentStatus(RotationAssignmentStatus.PENDING)
                    .project(project5)
                    .createdBy(managerUser)
                    .build();
                    
            // Additional future rotation for normalUser
            AssignedRotation assignedRotation10 = AssignedRotation.builder()
                    .assignedRotationId(new AssignedRotationId(normalUser.getUserId(), rotation8.getRotationId()))
                    .user(managerUser)
                    .rotation(rotation8)
                    .rotationAssignmentStatus(RotationAssignmentStatus.PENDING)
                    .project(project9)
                    .createdBy(adminUser)
                    .build();*/

            // First, update projects to ensure only one is active for Hamza
            project1.setStatus(ProjectStatus.ACTIVE); // Only this one will be active
            project2.setStatus(ProjectStatus.ACTIVE);
            project3.setStatus(ProjectStatus.ACTIVE);
            project4.setStatus(ProjectStatus.INACTIVE);
            project5.setStatus(ProjectStatus.ACTIVE);
            project6.setStatus(ProjectStatus.INACTIVE);
            project7.setStatus(ProjectStatus.CANCELLED);
            project8.setStatus(ProjectStatus.ACTIVE);
            project9.setStatus(ProjectStatus.ACTIVE);
            project10.setStatus(ProjectStatus.CANCELLED);
            
            // Save updated project statuses
            projectRepository.saveAll(List.of(project1, project2, project4, project3, project5, project6, project7, project8, project9, project10));

//            // Future rotation for managerUser (non-overlapping with rotation1)
//            AssignedRotation assignedRotation2 = AssignedRotation.builder()
//                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation2.getRotationId()))
//                    .user(managerUser)
//                    .rotation(rotation2)
//                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
//                    .project(project2) // PENDING project
//                    .createdBy(adminUser)
//                    .build();
//
//            // Future rotation for managerUser (non-overlapping with rotation1 and rotation2)
//            AssignedRotation assignedRotation3 = AssignedRotation.builder()
//                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation3.getRotationId()))
//                    .user(normalUser)
//                    .rotation(rotation3)
//                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
//                    .project(project3) // PENDING project
//                    .createdBy(adminUser)
//                    .build();
//
//            // Future rotation for managerUser (non-overlapping with previous rotations)
//            AssignedRotation assignedRotation4 = AssignedRotation.builder()
//                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation4.getRotationId()))
//                    .user(managerUser)
//                    .rotation(rotation4)
//                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
//                    .project(project5) // COMPLETED project
//                    .createdBy(adminUser)
//                    .build();
//
//            // Past rotation for managerUser (completed)
//            AssignedRotation assignedRotation5 = AssignedRotation.builder()
//                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation5.getRotationId()))
//                    .user(adminUser)
//                    .rotation(rotation5)
//                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
//                    .project(project6) // INACTIVE project
//                    .createdBy(adminUser)
//                    .build();
//
//            // Future rotation for managerUser (non-overlapping with previous rotations)
//            AssignedRotation assignedRotation6 = AssignedRotation.builder()
//                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation6.getRotationId()))
//                    .user(normalUser)
//                    .rotation(rotation6)
//                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
//                    .project(project7) // PENDING project
//                    .createdBy(adminUser)
//                    .build();
//
//            // Cancelled rotation for managerUser
//            AssignedRotation assignedRotation7 = AssignedRotation.builder()
//                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation7.getRotationId()))
//                    .user(managerUser)
//                    .rotation(rotation7)
//                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
//                    .project(project8) // CANCELLED project
//                    .createdBy(adminUser)
//                    .build();
//
//            // Past rotation for managerUser (completed)
//            AssignedRotation assignedRotation8 = AssignedRotation.builder()
//                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation8.getRotationId()))
//                    .user(adminUser)
//                    .rotation(rotation8)
//                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
//                    .project(project9) // COMPLETED project
//                    .createdBy(adminUser)
//                    .build();
//
//            // Far future rotation for managerUser (non-overlapping with all previous rotations)
//            AssignedRotation assignedRotation9 = AssignedRotation.builder()
//                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation9.getRotationId()))
//                    .user(normalUser)
//                    .rotation(rotation9)
//                    .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
//                    .project(project10) // Different project
//                    .createdBy(adminUser)
//                    .build();
//
//            // Far future rotation for managerUser (non-overlapping with all previous rotations)
//            AssignedRotation assignedRotation10 = AssignedRotation.builder()
//                    .assignedRotationId(new AssignedRotationId(managerUser.getUserId(), rotation10.getRotationId()))
//                    .user(managerUser)
//                    .rotation(rotation10)
//                    .rotationAssignmentStatus(RotationAssignmentStatus.PENDING)
//                    .project(project4) // Different project
//                    .createdBy(adminUser)
//                    .build();

            List<AssignedRotation> assignedRotations = List.of(assignedRotation1, assignedRotation2, assignedRotation3, assignedRotation4);
            assignedRotationRepository.saveAll(assignedRotations);

            // Create Logs with logical data for our three users - 10 entries total
            Log log1 = Log.builder()
                    .entityId(adminUser.getUserId())
                    .ipAddress("192.168.1.1")
                    .actionType("LOGIN")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .entityType("USER")
                    .actionDetails("Admin login successful")
                    .user(adminUser)
                    .build();

            Log log2 = Log.builder()
                    .entityId(project1.getProjectId())
                    .ipAddress("192.168.1.2")
                    .actionType("CREATE")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .entityType("PROJECT")
                    .actionDetails("Project created successfully by admin")
                    .user(adminUser)
                    .build();

            Log log3 = Log.builder()
                    .entityId(rotation1.getRotationId())
                    .ipAddress("192.168.1.3")
                    .actionType("UPDATE")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")
                    .entityType("ROTATION")
                    .actionDetails("Rotation schedule updated successfully by manager")
                    .user(managerUser)
                    .build();

            Log log4 = Log.builder()
                    .entityId(client1.getClientId())
                    .ipAddress("192.168.1.4")
                    .actionType("UPDATE")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .entityType("CLIENT")
                    .actionDetails("Client information updated by manager")
                    .user(managerUser)
                    .build();

            
            Log log6 = Log.builder()
                    .entityId(normalUser.getUserId())
                    .ipAddress("192.168.1.6")
                    .actionType("LOGIN")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Linux; Android 11; SM-G991B)")
                    .entityType("USER")
                    .actionDetails("User login from mobile device")
                    .user(normalUser)
                    .build();
                    
            Log log7 = Log.builder()
                    .entityId(project6.getProjectId())
                    .ipAddress("192.168.1.7")
                    .actionType("VIEW")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .entityType("PROJECT")
                    .actionDetails("Project dashboard viewed by user")
                    .user(normalUser)
                    .build();

                    
            Log log9 = Log.builder()
                    .entityId(managerUser.getUserId())
                    .ipAddress("192.168.1.9")
                    .actionType("PASSWORD_CHANGE")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .entityType("USER")
                    .actionDetails("User password changed successfully")
                    .user(managerUser)
                    .build();
                    
            Log log10 = Log.builder()
                    .entityId(project10.getProjectId())
                    .ipAddress("192.168.1.10")
                    .actionType("ASSIGN")
                    .status(LogStatus.SUCCESS)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .entityType("PROJECT")
                    .actionDetails("Project assigned to team successfully")
                    .user(adminUser)
                    .build();

            List<Log> logs = List.of(log1, log2, log3, log4, log6, log7, log9, log10);
            logRepository.saveAll(logs);

            // Create Notifications with logical data for our three users - 10 entries total
            Notification notification1 = Notification.builder()
                    .title("Welcome to RemoteSync")
                    .description("Welcome to the RemoteSync platform. Get started by exploring your dashboard.")
                    .status(NotificationStatus.NORMAL)
                    .receiver(normalUser)
                    .build();

            Notification notification2 = Notification.builder()
                    .title("New Rotation Assignment")
                    .description("You have been assigned to a new rotation. Please check your schedule.")
                    .status(NotificationStatus.IMPORTANT)
                    .receiver(normalUser)
                    .build();

            Notification notification3 = Notification.builder()
                    .title("Project Deadline Approaching")
                    .description("The deadline for project 'Analytics Dashboard' is approaching. Please ensure all tasks are completed.")
                    .status(NotificationStatus.ALERT)
                    .receiver(managerUser)
                    .build();

            Notification notification4 = Notification.builder()
                    .title("Rotation Override Request")
                    .description("Your request to override rotation has been approved.")
                    .status(NotificationStatus.INFO)
                    .receiver(normalUser)
                    .build();

            Notification notification5 = Notification.builder()
                    .title("System Maintenance")
                    .description("The system will undergo maintenance on Saturday night. Please save your work.")
                    .status(NotificationStatus.URGENT)
                    .receiver(adminUser)
                    .build();
            
            Notification notification6 = Notification.builder()
                    .title("New Project Assignment")
                    .description("You have been assigned to the 'Mobile Banking App' project.")
                    .status(NotificationStatus.IMPORTANT)
                    .receiver(managerUser)
                    .build();
                    
            Notification notification7 = Notification.builder()
                    .title("Weekly Report Due")
                    .description("Don't forget to submit your weekly project progress report.")
                    .status(NotificationStatus.NORMAL)
                    .receiver(normalUser)
                    .build();
                    
            Notification notification8 = Notification.builder()
                    .title("Client Meeting Scheduled")
                    .description("A meeting with client FG International has been scheduled for tomorrow at 14:00.")
                    .status(NotificationStatus.IMPORTANT)
                    .receiver(adminUser)
                    .build();
                    
            Notification notification9 = Notification.builder()
                    .title("Team Performance Review")
                    .description("The quarterly team performance review is scheduled for next Monday at 10:00.")
                    .status(NotificationStatus.IMPORTANT)
                    .receiver(managerUser)
                    .build();
                    
            Notification notification10 = Notification.builder()
                    .title("New Feature Deployment")
                    .description("The new feature set has been deployed to production. Please verify functionality.")
                    .status(NotificationStatus.ALERT)
                    .receiver(adminUser)
                    .build();

            List<Notification> notifications = List.of(notification1, notification2, notification3, notification4, 
                    notification5, notification6, notification7, notification8, notification9, notification10);
            notificationRepository.saveAll(notifications);

            // Create Reports with logical data for our three users - 10 entries total
            Report report1 = Report.builder()
                    .title("Rotation Request")
                    .reason("Need to change rotation due to personal reasons")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.PENDING)
                    .description("I need to change my rotation schedule due to a family emergency.")
                    .createdBy(managerUser)
                    .build();

            Report report2 = Report.builder()
                    .title("Rotation Request")
                    .reason("Project requirements changed")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.ACCEPTED)
                    .description("The project requirements have changed, and I need to adjust my rotation schedule.")
                    .createdBy(managerUser)
                    .updatedBy(adminUser)
                    .build();

            Report report3 = Report.builder()
                    .title("Project Status Report")
                    .reason("Weekly status update")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.ACCEPTED)
                    .description("Weekly status report for the Mobile Banking App project. All tasks on schedule.")
                    .createdBy(managerUser)
                    .updatedBy(adminUser)
                    .build();

            Report report4 = Report.builder()
                    .title("Rotation Schedule Feedback")
                    .reason("Improving team coordination")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.OPENED)
                    .description("Suggestions for improving the rotation scheduling process to enhance team coordination.")
                    .createdBy(normalUser)
                    .build();

            Report report5 = Report.builder()
                    .title("Rotation Request")
                    .reason("Health issues")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.PENDING)
                    .description("Due to health issues, I need to reschedule my rotation.")
                    .createdBy(normalUser)
                    .build();
            
            Report report6 = Report.builder()
                    .title("Client Feedback Report")
                    .reason("Client satisfaction survey")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.ACCEPTED)
                    .description("Detailed feedback from client TC Solutions about the CRM System implementation.")
                    .createdBy(adminUser)
                    .build();
                    
            Report report7 = Report.builder()
                    .title("Performance Evaluation")
                    .reason("Quarterly team assessment")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.PENDING)
                    .description("Quarterly performance review for the development team working on the Analytics Dashboard.")
                    .createdBy(adminUser)
                    .build();
                    
            Report report8 = Report.builder()
                    .title("Resource Allocation Report")
                    .reason("Project resource optimization")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.OPENED)
                    .description("Analysis of current resource allocation across active projects with recommendations for optimization.")
                    .createdBy(managerUser)
                    .build();
                    
            Report report9 = Report.builder()
                    .title("Security Audit Report")
                    .reason("Quarterly security assessment")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.ACCEPTED)
                    .description("Comprehensive security audit of all system components with recommendations for improvements.")
                    .createdBy(adminUser)
                    .updatedBy(adminUser)
                    .build();
                    
            Report report10 = Report.builder()
                    .title("Training Needs Assessment")
                    .reason("Skills gap analysis")
                    .type(ReportType.REQUEST_ROTATION)
                    .status(ReportStatus.PENDING)
                    .description("Assessment of training needs for team members working on the Energy Analytics project.")
                    .createdBy(managerUser)
                    .build();

            List<Report> reports = List.of(report1, report2, report3, report4, report5, report6, report7, report8, report9, report10);
            reportRepository.saveAll(reports);
            
            // Log successful initialization
            System.out.println("RemoteSync application initialized successfully with test data.");
            System.out.println("Created users: " + users.size() + " (Admin, Manager, Normal User)");
            System.out.println("Created clients: " + clients.size());
            System.out.println("Created projects: " + projects.size());
            System.out.println("Created rotations: " + rotations.size());
            System.out.println("Created assigned rotations: " + assignedRotations.size());
            System.out.println("Created reports: " + reports.size());
            System.out.println("Created notifications: " + notifications.size());
            System.out.println("Created logs: " + logs.size());
        };
    }
}
