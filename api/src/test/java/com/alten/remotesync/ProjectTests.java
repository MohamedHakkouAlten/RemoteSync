package com.alten.remotesync;

import com.alten.remotesync.application.globalDTO.GlobalDTO;
import com.alten.remotesync.application.globalDTO.PagedGlobalIdDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByClientDTO;
import com.alten.remotesync.application.project.record.request.AssociateProjectByLabelDTO;
import com.alten.remotesync.application.project.record.response.PagedProjectDTO;
import com.alten.remotesync.application.project.record.response.ProjectDTO;
import com.alten.remotesync.application.project.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class ProjectTests {


    @Autowired
    private ProjectService projectService;

    @Test
    void TestGetProjectsCountByUser(){
        UUID userId=UUID.fromString("e9f0a1b2-c3d4-e5f6-7890-a7d8e9a1b2c3");
        assertEquals(2,projectService.getAssociateProjectsCount(GlobalDTO.fromUserId(userId)).projectsCount());
    }
    @Test
    void TestSearchAssociateProjects(){
        UUID userId=UUID.fromString("e9f0a1b2-c3d4-e5f6-7890-a7d8e9a1b2c3");
        List<ProjectDTO> projectDTOS=projectService.getAssociateOldProjectsByLabel(GlobalDTO.fromUserId(userId),new AssociateProjectByLabelDTO("Project", 0,null)).projectDTOS();
        assertEquals(1,projectDTOS.size());
        assertNotNull(projectDTOS.get(0).owner());

    }
    @Test
    void TestGetAssociateProjects(){
        UUID userId=UUID.fromString("e9f0a1b2-c3d4-e5f6-7890-a7d8e9a1b2c3");
        List<ProjectDTO> projectDTOS= projectService.getAssociateOldProjects(GlobalDTO.fromUserId(userId),new PagedGlobalIdDTO(0,10)).projectDTOS();
        assertEquals(1,projectDTOS.size());
        assertNotNull(projectDTOS.get(0).owner());

    }
    @Test
    void TestGetProjectDetails(){
        UUID projectId=UUID.fromString("a6d7e8f7-8901-b2c3-d4e5-f67890a7d8e9");
        ProjectDTO projectDTO= projectService.getProjectDetails(GlobalDTO.fromProjectId(projectId));
        assertNotNull(projectDTO);

    }
    @Test
    void TestGetProjectsByClient(){
        UUID userId=UUID.fromString("e9f0a1b2-c3d4-e5f6-7890-a7d8e9a1b2c3");
        UUID clientId=UUID.fromString("e5f67890-a5d6-e7f7-8901-b2c3d4e5f678");
        PagedProjectDTO projectDTO= projectService.getAssociateProjectsByClient(GlobalDTO.fromUserId(userId),new AssociateProjectByClientDTO(clientId,0,10));
        System.out.println(projectDTO.projectDTOS().get(0).owner());
        assertThat(projectDTO.projectDTOS().size()).isGreaterThan(0);

    }


}
