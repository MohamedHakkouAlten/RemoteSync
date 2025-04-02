package com.alten.remotesync.application.rotation.service;

import com.alten.remotesync.application.rotation.record.request.CreateRotationDTO;
import com.alten.remotesync.application.rotation.record.response.RotationResponseDTO;
import com.alten.remotesync.domain.assignedRotation.enumeration.RotationAssignmentStatus;
import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.assignedRotation.model.embeddable.AssignedRotationId;
import com.alten.remotesync.domain.assignedRotation.repository.AssignedRotationDomainRepository;
import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.project.repository.ProjectDomainRepository;
import com.alten.remotesync.domain.rotation.model.Rotation;
import com.alten.remotesync.domain.rotation.repository.RotationDomainRepository;
import com.alten.remotesync.domain.user.model.User;
import com.alten.remotesync.domain.user.repository.UserDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class RotationServiceImp implements RotationService {

    private final RotationDomainRepository rotationDomainRepository;
    private final AssignedRotationDomainRepository assignedRotationDomainRepository;
    private final UserDomainRepository userDomainRepository;
    private final ProjectDomainRepository projectDomainRepository;

    @Override
    @Transactional
    public RotationResponseDTO createRotation(CreateRotationDTO createRotationDTO) {
        Project project = projectDomainRepository.findById(createRotationDTO.projectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + createRotationDTO.projectId()));

        List<User> users = createRotationDTO.userIds().stream()
                .map(userId -> userDomainRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId)))
                .collect(Collectors.toList());

        List<Date> dates = createRotationDTO.dates();
        Date startDate = dates.get(0);
        Date endDate = dates.get(dates.size() - 1);

        Rotation rotation = Rotation.builder()
                .name(createRotationDTO.rotationName())
                .startDate(startDate)
                .endDate(endDate)
                .customDates(dates)
                .rotationSequence(1)
                .build();

        Rotation savedRotation = rotationDomainRepository.save(rotation);

        for (User user : users) {
            AssignedRotationId assignedRotationId = new AssignedRotationId(user.getUserId(), savedRotation.getRotationId());
            AssignedRotation assignedRotation = AssignedRotation.builder()
                    .assignedRotationId(assignedRotationId)
                    .user(user)
                    .rotation(savedRotation)
                    .project(project)
                    .rotationAssignmentStatus(RotationAssignmentStatus.PENDING)
                    .overrideDate(null)
                    .build();

            assignedRotationDomainRepository.save(assignedRotation);
        }

        return new RotationResponseDTO(
                savedRotation.getRotationId(),
                savedRotation.getName(),
                savedRotation.getStartDate(),
                savedRotation.getEndDate(),
                project.getProjectId()
        );
    }
}
