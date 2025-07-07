package com.alten.remotesync;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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

    @Bean
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
            // CHECK: Only fill the DB if it's empty
            if (userRepository.count() > 0) {
                System.out.println("La base de données contient déjà des données. Initialisation ignorée.");
                return;
            }

            System.out.println("Base de données vide. Initialisation des données de test...");

            // Create Roles and Privileges
            List<Role> roles = new ArrayList<>();
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

            // Create Factories (French) - 15 total
            List<Factory> factories = new ArrayList<>(List.of(
                    Factory.builder().label("ALTEN CASABLANCA").City("Casablanca").address("123 Zone Industrielle, Casablanca").isDeleted(false).build(),
                    Factory.builder().label("ALTEN RABAT").City("Rabat").address("456 Parc Technologique, Rabat").isDeleted(false).build(),
                    Factory.builder().label("ALTEN TANGER").City("Tanger").address("789 Zone Portuaire, Tanger").isDeleted(false).build(),
                    Factory.builder().label("ALTEN MARRAKECH").City("Marrakech").address("101 Hub d'Innovation, Marrakech").isDeleted(false).build(),
                    Factory.builder().label("ALTEN AGADIR").City("Agadir").address("202 Centre Technologique, Agadir").isDeleted(false).build()
            ));
            // Add 10 more factories
            factories.add(Factory.builder().label("ALTEN FÈS").City("Fès").address("303 Quartier Industriel, Fès").isDeleted(false).build());
            factories.add(Factory.builder().label("ALTEN MEKNÈS").City("Meknès").address("404 Avenue de l'Industrie, Meknès").isDeleted(false).build());
            factories.add(Factory.builder().label("ALTEN OUJDA").City("Oujda").address("505 Boulevard de la Technologie, Oujda").isDeleted(false).build());
            factories.add(Factory.builder().label("ALTEN KENITRA").City("Kénitra").address("606 Zone Franche, Kénitra").isDeleted(false).build());
            factories.add(Factory.builder().label("ALTEN TÉTOUAN").City("Tétouan").address("707 Parc Shore, Tétouan").isDeleted(false).build());
            factories.add(Factory.builder().label("ALTEN LAÂYOUNE").City("Laâyoune").address("808 Pôle Technologique, Laâyoune").isDeleted(false).build());
            factories.add(Factory.builder().label("ALTEN DAKHLA").City("Dakhla").address("909 Avenue de l'Innovation, Dakhla").isDeleted(false).build());
            factories.add(Factory.builder().label("ALTEN EL JADIDA").City("El Jadida").address("110 Zone Industrielle, El Jadida").isDeleted(false).build());
            factories.add(Factory.builder().label("ALTEN BENI MELLAL").City("Béni Mellal").address("112 Agropole, Béni Mellal").isDeleted(false).build());
            factories.add(Factory.builder().label("ALTEN NADOR").City("Nador").address("113 West Med, Nador").isDeleted(false).build());
            factoryRepository.saveAll(factories);

            // Create SubFactories (French) - 15 total
            List<SubFactory> subFactories = new ArrayList<>(List.of(
                    SubFactory.builder().label("RH").title("Ressources Humaines").capacity(30).factory(factories.get(0)).isDeleted(false).build(),
                    SubFactory.builder().label("DEV").title("Développement").capacity(50).factory(factories.get(0)).isDeleted(false).build(),
                    SubFactory.builder().label("CONSULTANT").title("Conseil").capacity(40).factory(factories.get(1)).isDeleted(false).build(),
                    SubFactory.builder().label("QA").title("Assurance Qualité").capacity(25).factory(factories.get(1)).isDeleted(false).build(),
                    SubFactory.builder().label("DESIGN").title("Conception UI/UX").capacity(20).factory(factories.get(2)).isDeleted(false).build()
            ));
            // Add 10 more sub-factories
            subFactories.add(SubFactory.builder().label("DATA").title("Science des Données").capacity(35).factory(factories.get(3)).isDeleted(false).build());
            subFactories.add(SubFactory.builder().label("INFRA").title("Infrastructure & DevOps").capacity(25).factory(factories.get(4)).isDeleted(false).build());
            subFactories.add(SubFactory.builder().label("SUPPORT").title("Support Technique").capacity(30).factory(factories.get(5)).isDeleted(false).build());
            subFactories.add(SubFactory.builder().label("FINANCE").title("Finance & Comptabilité").capacity(15).factory(factories.get(6)).isDeleted(false).build());
            subFactories.add(SubFactory.builder().label("MARKETING").title("Marketing Digital").capacity(20).factory(factories.get(7)).isDeleted(false).build());
            subFactories.add(SubFactory.builder().label("BI").title("Business Intelligence").capacity(22).factory(factories.get(8)).isDeleted(false).build());
            subFactories.add(SubFactory.builder().label("CYBER").title("Cybersécurité").capacity(18).factory(factories.get(9)).isDeleted(false).build());
            subFactories.add(SubFactory.builder().label("LEGAL").title("Juridique").capacity(10).factory(factories.get(10)).isDeleted(false).build());
            subFactories.add(SubFactory.builder().label("EMBARQUE").title("Systèmes Embarqués").capacity(40).factory(factories.get(11)).isDeleted(false).build());
            subFactories.add(SubFactory.builder().label("LOGISTIQUE").title("Logistique").capacity(28).factory(factories.get(12)).isDeleted(false).build());
            subFactoryRepository.saveAll(subFactories);

            // Create Users - 13 total
            List<User> users = new ArrayList<>();
            User managerUser1 = User.builder().firstName("Maryam").lastName("Alaoui Ismaili").email("maryam.alaoui@remotesync.com").username("maryamalaouiismaili").password(passwordEncoder.encode("admin123")).reference(1001L).phoneNumber("+212600000001").roles(List.of(roles.get(2))).isDeleted(false).subFactory(subFactories.get(0)).build();
            User normalUser = User.builder().firstName("Hamza").lastName("Jdaidi").email("hamza.jdaidi@remotesync.com").username("hamzajdaidi").password(passwordEncoder.encode("manager123")).reference(1002L).phoneNumber("+212600000002").roles(List.of(roles.get(1))).isDeleted(false).subFactory(subFactories.get(0)).build();
            User managerUser2 = User.builder().firstName("Mohamed").lastName("Hakkou").email("hakkoumohamed23@gmail.com").username("mohamedhakkou").password(passwordEncoder.encode("client123")).reference(1006L).phoneNumber("+212600000006").roles(List.of(roles.get(2))).isDeleted(false).subFactory(subFactories.get(4)).build();
            users.addAll(List.of(managerUser2, managerUser1, normalUser));

            // Add 10 more generic users
            String[] firstNames = {"Fatima", "Karim", "Amina", "Youssef", "Nadia", "Said", "Layla", "Amine", "Sofia", "Omar"};
            String[] lastNames = {"Bennani", "Cherkaoui", "Saidi", "Tazi", "El Fassi", "Kettani", "Guerrouj", "Berrada", "Lahlou", "Filali"};
            for (int i = 0; i < 10; i++) {
                users.add(User.builder().firstName(firstNames[i]).lastName(lastNames[i]).email(firstNames[i].toLowerCase() + "." + lastNames[i].toLowerCase() + "@remotesync.com").username(firstNames[i].toLowerCase() + lastNames[i].toLowerCase()).password(passwordEncoder.encode("user123")).reference(2000L + i).phoneNumber("+21261000000" + i).roles(List.of(roles.get(1))) // Normal User role
                        .isDeleted(false).subFactory(subFactories.get(i % subFactories.size())).build());
            }
            userRepository.saveAll(users);

            // Create Clients (French) - 20 total
            List<Client> clients = new ArrayList<>(List.of(
                    Client.builder().label("TC").ICE("ICE123456789").address("123 Rue de la Tech, Casablanca").email("contact@tc.com").name("Solutions TC").sector("Technologie de l'Information").isDeleted(false).build(),
                    Client.builder().label("FG").ICE("ICE12345678900").address("456 Avenue de la Finance, Rabat").email("info@fg.com").name("FG International").sector("Banque & Finance").isDeleted(false).build(),
                    Client.builder().label("TL").ICE("ICE1234567890000").address("789 Boulevard du Transport, Marrakech").email("support@tl.com").name("Solutions TL").sector("Transport").isDeleted(false).build(),
                    Client.builder().label("ET").ICE("ICE0000123456789").address("101 Route de l'Éducation, Tanger").email("info@et.com").name("Systèmes Éducatifs ET").sector("Éducation").isDeleted(false).build(),
                    Client.builder().label("RC").ICE("IC000E123456789").address("202 Rue du Commerce, Agadir").email("ventes@rc.com").name("Chaîne de Vente au Détail RC").sector("Vente au détail").isDeleted(false).build(),
                    Client.builder().label("HC").ICE("ICE987654321").address("505 Boulevard de la Santé, Fès").email("info@hc.com").name("Systèmes de Santé HC").sector("Santé").isDeleted(false).build(),
                    Client.builder().label("MS").ICE("ICE567891234").address("707 Allée de la Manufacture, Tanger").email("contact@ms.com").name("Solutions de Fabrication MS").sector("Industrie").isDeleted(false).build(),
                    Client.builder().label("TS").ICE("ICE112233445").address("909 Avenue du Tourisme, Marrakech").email("info@ts.com").name("Services Touristiques TS").sector("Tourisme").isDeleted(false).build(),
                    Client.builder().label("ES").ICE("ICE998877665").address("111 Place de l'Énergie, Casablanca").email("contact@es.com").name("Solutions Énergétiques ES").sector("Énergie").isDeleted(false).build(),
                    Client.builder().label("LP").ICE("ICE556677889").address("222 Rue Juridique, Rabat").email("info@lp.com").name("Partenaires Juridiques LP").sector("Services Juridiques").isDeleted(false).build()
            ));
            // Add 10 more clients
            clients.add(Client.builder().label("AGRI").ICE("ICEAGRI123").address("333 Route Agricole, Meknès").email("contact@agri.com").name("Agri-Tech Maroc").sector("Agriculture").isDeleted(false).build());
            clients.add(Client.builder().label("MEDIA").ICE("ICEMEDIA456").address("444 Boulevard des Médias, Casablanca").email("presse@media.com").name("Groupe Média Horizon").sector("Médias").isDeleted(false).build());
            clients.add(Client.builder().label("IMMO").ICE("ICEIMMO789").address("555 Avenue Immobilière, Marrakech").email("info@immo.com").name("Immobilier Prestige").sector("Immobilier").isDeleted(false).build());
            clients.add(Client.builder().label("AUTO").ICE("ICEAUTO101").address("666 Zone Franche Auto, Kénitra").email("contact@auto.com").name("Automotive Connect").sector("Automobile").isDeleted(false).build());
            clients.add(Client.builder().label("AERO").ICE("ICEAERO112").address("777 Pôle Aéronautique, Casablanca").email("info@aero.com").name("Aérospace Maroc").sector("Aéronautique").isDeleted(false).build());
            clients.add(Client.builder().label("TELECOM").ICE("ICETEL313").address("888 Tour des Télécoms, Rabat").email("support@telecom.ma").name("Maroc Télécommunications").sector("Télécommunications").isDeleted(false).build());
            clients.add(Client.builder().label("CHIMIE").ICE("ICECHIM414").address("999 Complexe Chimique, Jorf Lasfar").email("contact@chimie.com").name("Chimica Solutions").sector("Chimie").isDeleted(false).build());
            clients.add(Client.builder().label("TEXTILE").ICE("ICETEX515").address("121 Quartier Textile, Fès").email("ventes@textile.com").name("Le Fil d'Or").sector("Textile").isDeleted(false).build());
            clients.add(Client.builder().label("PECHE").ICE("ICEPECHE616").address("232 Port de Pêche, Dakhla").email("contact@peche.com").name("Océan Pêche").sector("Pêche").isDeleted(false).build());
            clients.add(Client.builder().label("ARTISANAT").ICE("ICEART717").address("343 Médina Artisanale, Marrakech").email("info@artisanat.ma").name("Trésors de l'Atlas").sector("Artisanat").isDeleted(false).build());
            clientRepository.saveAll(clients);

            // Create Projects (French) - 20 total
            List<Project> projects = new ArrayList<>();
            ProjectStatus[] statuses = ProjectStatus.values();

            projects.add(Project.builder().label("PROJ-TC-01").titre("Système de Gestion de la Relation Client").status(ProjectStatus.ACTIVE).startDate(LocalDate.now()).deadLine(LocalDate.now().plusDays(90)).isDeleted(false).owner(clients.get(0)).build());
            projects.add(Project.builder().label("PROJ-FG-01").titre("Application Bancaire Mobile Nouvelle Génération").status(ProjectStatus.ACTIVE).startDate(LocalDate.now()).deadLine(LocalDate.now().plusDays(120)).isDeleted(false).owner(clients.get(1)).build());
            projects.add(Project.builder().label("PROJ-TL-01").titre("Portail de Gestion des Patients en Ligne").status(ProjectStatus.ACTIVE).startDate(LocalDate.now()).deadLine(LocalDate.now().plusDays(60)).isDeleted(false).owner(clients.get(2)).build());
            projects.add(Project.builder().label("PROJ-ET-01").titre("Plateforme E-Learning Interactive").status(ProjectStatus.COMPLETED).startDate(LocalDate.now().minusDays(100)).deadLine(LocalDate.now().minusDays(10)).isDeleted(false).owner(clients.get(3)).build());
            projects.add(Project.builder().label("PROJ-RC-01").titre("Système de Gestion des Stocks pour la Vente au Détail").status(ProjectStatus.INACTIVE).startDate(LocalDate.now()).deadLine(LocalDate.now().plusDays(45)).isDeleted(false).owner(clients.get(4)).build());
            projects.add(Project.builder().label("PROJ-HC-01").titre("Tableau de Bord d'Analyse BI").status(ProjectStatus.ACTIVE).startDate(LocalDate.now()).deadLine(LocalDate.now().plusDays(75)).isDeleted(false).owner(clients.get(5)).build());
            projects.add(Project.builder().label("PROJ-MS-01").titre("Application Mobile de Santé").status(ProjectStatus.ACTIVE).startDate(LocalDate.now()).deadLine(LocalDate.now().plusDays(110)).isDeleted(false).owner(clients.get(6)).build());
            projects.add(Project.builder().label("PROJ-TS-01").titre("Système de Gestion de la Chaîne d'Approvisionnement").status(ProjectStatus.INACTIVE).startDate(LocalDate.now()).deadLine(LocalDate.now().plusDays(150)).isDeleted(false).owner(clients.get(7)).build());
            projects.add(Project.builder().label("PROJ-ES-01").titre("Plateforme de Réservation Touristique").status(ProjectStatus.ACTIVE).startDate(LocalDate.now()).deadLine(LocalDate.now().plusDays(180)).isDeleted(false).owner(clients.get(8)).build());
            projects.add(Project.builder().label("PROJ-LP-01").titre("Plateforme d'Analyse de la Consommation d'Énergie").status(ProjectStatus.ACTIVE).startDate(LocalDate.now()).deadLine(LocalDate.now().plusDays(200)).isDeleted(false).owner(clients.get(9)).build());

            String[] projectPrefixes = {"Optimisation de", "Développement d'", "Implémentation d'", "Refonte de", "Création d'une", "Migration vers", "Analyse de", "Sécurisation de", "Automatisation des", "Intégration de"};
            for (int i = 0; i < 10; i++) {
                Client ownerClient = clients.get(10 + i);
                String projectTitle = projectPrefixes[i] + " " + ownerClient.getName();
                String projectLabel = "PROJ-" + ownerClient.getLabel() + "-" + String.format("%02d", i + 1); // e.g., PROJ-AGRI-01

                projects.add(Project.builder()
                        .label(projectLabel)
                        .titre(projectTitle)
                        .status(statuses[i % statuses.length])
                        .startDate(LocalDate.now().plusDays(i * 10))
                        .deadLine(LocalDate.now().plusDays(90 + i * 20))
                        .isDeleted(false)
                        .owner(ownerClient)
                        .build());
            }
            projectRepository.saveAll(projects);


            // Create Rotations - 14 total
            LocalDate today = LocalDate.now();
            List<Rotation> rotations = new ArrayList<>();
            for (int i = 1; i <= 14; i++) {
                Rotation rotation = Rotation.builder()
                        .name("Rotation " + i)
                        .startDate(today.minusWeeks(i).with(DayOfWeek.MONDAY))
                        .endDate(today.plusWeeks(i).with(DayOfWeek.SUNDAY))
                        .cycleLengthWeeks(ThreadLocalRandom.current().nextInt(2, 5)) // 2 to 4 weeks cycle
                        .remoteWeeksPerCycle(ThreadLocalRandom.current().nextInt(1, 3)) // 1 or 2 remote weeks
                        .build();

                if (i % 3 == 0) {
                    Map<LocalDate, RotationStatus> customDates = Map.of(
                            today.plusDays(i), RotationStatus.ONSITE,
                            today.plusDays(i + 1), RotationStatus.REMOTE
                    );
                    rotation.setCustomDates(customDates.entrySet().stream()
                            .map(e -> CustomDate.builder().date(e.getKey()).rotationStatus(e.getValue()).build())
                            .collect(Collectors.toList()));
                }
                rotations.add(rotation);
            }
            rotationRepository.saveAll(rotations);

            // Create AssignedRotations - 13 total
            List<AssignedRotation> assignedRotations = new ArrayList<>();
            Set<AssignedRotationId> usedIds = new HashSet<>();

            for (int i = 0; i < 13; i++) {
                User user = users.get(i);
                Rotation rotation = rotations.get(i);
                Project project = projects.get(i % projects.size());
                AssignedRotationId id = new AssignedRotationId(user.getUserId(), rotation.getRotationId());

                if (!usedIds.contains(id)) {
                    AssignedRotation ar = AssignedRotation.builder()
                            .assignedRotationId(id)
                            .user(user)
                            .rotation(rotation)
                            .rotationAssignmentStatus(RotationAssignmentStatus.ACTIVE)
                            .project(project)
                            .createdBy(managerUser1)
                            .build();
                    assignedRotations.add(ar);
                    usedIds.add(id);
                }
            }
            assignedRotationRepository.saveAll(assignedRotations);

            // Create Logs (French) - 18 total
            List<Log> logs = new ArrayList<>(List.of(
                    Log.builder().entityId(managerUser1.getUserId()).ipAddress("192.168.1.1").actionType("CONNEXION").status(LogStatus.SUCCESS).userAgent("Mozilla/5.0").entityType("UTILISATEUR").actionDetails("Connexion de l'admin réussie").user(managerUser1).build(),
                    Log.builder().entityId(projects.get(0).getProjectId()).ipAddress("192.168.1.2").actionType("CRÉATION").status(LogStatus.SUCCESS).userAgent("Mozilla/5.0").entityType("PROJET").actionDetails("Projet créé avec succès par l'admin").user(managerUser1).build(),
                    Log.builder().entityId(rotations.get(0).getRotationId()).ipAddress("192.168.1.3").actionType("MISE À JOUR").status(LogStatus.SUCCESS).userAgent("Mozilla/5.0").entityType("ROTATION").actionDetails("Planning de rotation mis à jour par le manager").user(managerUser1).build(),
                    Log.builder().entityId(clients.get(0).getClientId()).ipAddress("192.168.1.4").actionType("MISE À JOUR").status(LogStatus.SUCCESS).userAgent("Mozilla/5.0").entityType("CLIENT").actionDetails("Infos client mises à jour par le manager").user(managerUser1).build(),
                    Log.builder().entityId(normalUser.getUserId()).ipAddress("192.168.1.6").actionType("CONNEXION").status(LogStatus.SUCCESS).userAgent("Mozilla/5.0").entityType("UTILISATEUR").actionDetails("Connexion utilisateur depuis un appareil mobile").user(normalUser).build(),
                    Log.builder().entityId(projects.get(5).getProjectId()).ipAddress("192.168.1.7").actionType("CONSULTATION").status(LogStatus.SUCCESS).userAgent("Mozilla/5.0").entityType("PROJET").actionDetails("Tableau de bord du projet consulté par l'utilisateur").user(normalUser).build(),
                    Log.builder().entityId(managerUser2.getUserId()).ipAddress("192.168.1.9").actionType("CHANGEMENT_MDP").status(LogStatus.SUCCESS).userAgent("Mozilla/5.0").entityType("UTILISATEUR").actionDetails("Mot de passe utilisateur changé avec succès").user(managerUser2).build(),
                    Log.builder().entityId(projects.get(9).getProjectId()).ipAddress("192.168.1.10").actionType("AFFECTATION").status(LogStatus.SUCCESS).userAgent("Mozilla/5.0").entityType("PROJET").actionDetails("Projet affecté à l'équipe avec succès").user(managerUser1).build()
            ));
            String[] logActions = {"SUPPRESSION", "EXPORTATION", "IMPORTATION", "APPROBATION", "REJET", "ARCHIVAGE", "RESTAURATION", "NOTIFICATION_ENVOYÉE", "DÉCONNEXION", "ACCÈS_REFUSÉ"};

            logRepository.saveAll(logs);

            List<Report> reports = new ArrayList<>();

            // Define a list of users who will create reports
            List<User> usersToReport = new ArrayList<>();
            usersToReport.add(normalUser); // Add the specific 'normalUser'
            for (int i = 3; i <= 12; i++) { // Add users from index 3 to 12
                usersToReport.add(users.get(i));
            }

            // Create varied reasons and descriptions for the reports
            String[] reasons = {
                    "Problème de santé",
                    "Rendez-vous médical",
                    "Urgence familiale",
                    "Contrainte de transport",
                    "Enfant malade",
                    "Rendez-vous administratif",
                    "Travaux à domicile"
            };

            String[] descriptions = {
                    "Bonjour, je souhaiterais travailler à distance cette semaine pour la raison mentionnée.",
                    "En raison d'un imprévu, je demande la permission de modifier mon planning de travail.",
                    "Je demande à échanger ma présence sur site avec une semaine à distance.",
                    "Pourrais-je exceptionnellement venir au bureau pendant ma semaine de travail à distance ?",
                    "J'ai besoin d'ajuster mon organisation de travail pour les jours à venir.",
                    "Je demande à échanger ma présence sur site avec une semaine à distance.",
                    "En raison d'un imprévu, je demande la permission de modifier mon planning de travail."
            };


            // Loop through each specified user and create 5 reports for them
            for (User user : usersToReport) {
                for (int i = 0; i < 6; i++) {
                    // Pick a reason, description, and status to make the data varied
                    String reason = reasons[i];
                    String description = descriptions[i];
                    ReportStatus status = (i % 2 == 0) ? ReportStatus.PENDING : ReportStatus.values()[i % 4];

                    Report report = Report.builder()
                            .title("Rapport - " + reason)
                            .reason(reason)
                            .type(ReportType.REQUEST_ROTATION)
                            .status(status)
                            .description(description)
                            .createdBy(user)
                            .build();

                    // If a report is accepted or rejected, it makes sense that a manager updated it
                    if (status == ReportStatus.ACCEPTED || status == ReportStatus.REJECTED) {
                        report.setUpdatedBy(managerUser1); // Assign a manager as the updater
                    }

                    reports.add(report);
                }
            }

            reportRepository.saveAll(reports);
            List<Notification> notifications = new ArrayList<>();

            // Define the list of users who will receive notifications
            List<User> usersToNotify = new ArrayList<>();
            usersToNotify.add(normalUser); // Add the specific 'normalUser'
            for (int i = 3; i <= 12; i++) { // Add users from index 3 to 12
                usersToNotify.add(users.get(i));
            }

            // --- Templates for User Notifications ---
            String[] reportTitles = {
                    "Mise à jour de votre rapport",
                    "Votre rapport a été approuvé",
                    "Action requise sur votre rapport"
            };
            String[] reportDescriptions = {
                    "Le statut de votre rapport a été mis à jour par un manager.",
                    "Bonne nouvelle ! Votre rapport a été accepté et votre planning sera ajusté en conséquence.",
                    "Votre rapport a été rejeté. Veuillez consulter les commentaires et soumettre une nouvelle version si nécessaire."
            };

            String[] rotationTitles = {
                    "Votre nouveau planning de rotation",
                    "Rappel : Début de votre rotation sur site",
                    "Mise à jour du calendrier de rotation"
            };
            String[] rotationDescriptions = {
                    "Votre planning de rotation pour la prochaine période a été publié. Vous pouvez le consulter dès maintenant.",
                    "Ceci est un rappel que votre semaine sur site pour la rotation en cours commence lundi prochain.",
                    "Une mise à jour a été appliquée au calendrier général des rotations. Veuillez vérifier votre planning."
            };


            int notificationCounter = 0;

            // Loop through each user and create one notification for a report and one for a rotation
            for (User user : usersToNotify) {
                // 1. Create a notification about a REPORT
                notifications.add(Notification.builder()
                        .title(reportTitles[notificationCounter % reportTitles.length])
                        .description(reportDescriptions[notificationCounter % reportDescriptions.length])
                        .status(NotificationStatus.URGENT)
                        .isRead(notificationCounter % 2 == 0) // Alternate between read and unread
                        .receiver(user)
                        .build());

                // 2. Create a notification about a ROTATION
                notifications.add(Notification.builder()
                        .title(rotationTitles[notificationCounter % rotationTitles.length])
                        .description(rotationDescriptions[notificationCounter % rotationDescriptions.length])
                        .status(NotificationStatus.URGENT)
                        .isRead(notificationCounter % 2 != 0) // Alternate
                        .receiver(user)
                        .build());

                notificationCounter++;
            }

            // --- Notifications for MANAGERS about new reports ---
            notifications.add(Notification.builder()
                    .title("Nouveau rapport soumis à traiter")
                    .description(normalUser.getFirstName() + " a soumis un nouveau rapport pour examen.")
                    .status(NotificationStatus.URGENT)
                    .isRead(false)
                    .receiver(managerUser1)
                    .build());

            notifications.add(Notification.builder()
                    .title("Rapport en attente de validation")
                    .description("Un rapport de " + users.get(4).getFirstName() + " est en attente de votre validation.")
                    .status(NotificationStatus.URGENT)
                    .isRead(false)
                    .receiver(managerUser2)
                    .build());


            notifications.add(Notification.builder().title("Rapport de rotation à traiter").description(users.get(4).getFirstName() + " a soumis une demande pour un rendez-vous médical.").status(NotificationStatus.URGENT).isRead(true).receiver(managerUser2).build());
            notifications.add(Notification.builder().title("Rapport de rotation en attente").description(users.get(6).getFirstName() + " a soumis une demande de présence sur site.").status(NotificationStatus.URGENT).isRead(false).receiver(managerUser2).build());

            // Notifications for Users about the status of their requests
            notifications.add(Notification.builder().title("Votre rapport de rotation a été approuvée").description("Votre demande de permutation pour urgence familiale a été approuvée par " + managerUser1.getFirstName() + ".").status(NotificationStatus.URGENT).isRead(false).receiver(users.get(3)).build());
            notifications.add(Notification.builder().title("Votre rapport de rotation a été rejetée").description("Votre demande d'échange de rotation a été rejetée. Veuillez contacter votre manager.").status(NotificationStatus.URGENT).isRead(false).receiver(users.get(5)).build());
            notifications.add(Notification.builder().title("Votre planning a été mis à jour").description("Votre planning de rotation pour le prochain cycle est disponible.").status(NotificationStatus.URGENT).isRead(false).receiver(normalUser).build());


            notificationRepository.saveAll(notifications);
            // Log successful initialization
            System.out.println("Application RemoteSync initialisée avec succès avec des données de test en français.");
            System.out.println("Utilisateurs créés: " + userRepository.count());
            System.out.println("Clients créés: " + clientRepository.count());
            System.out.println("Projets créés: " + projectRepository.count());
            System.out.println("Rotations créées: " + rotationRepository.count());
            System.out.println("Affectations de rotation créées: " + assignedRotationRepository.count());
            System.out.println("Rapports créés: " + reportRepository.count());
            System.out.println("Notifications créées: " + notificationRepository.count());
            System.out.println("Logs créés: " + logRepository.count());
        };
    }
}