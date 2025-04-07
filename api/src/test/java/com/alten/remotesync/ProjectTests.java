package com.alten.remotesync;

import com.alten.remotesync.application.report.record.request.CreateAssociateReportDTO;
import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.domain.report.enumeration.ReportType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProjectTests {


    private int port=8080;
    private String baseUrl;
    private TestRestTemplate restTemplate;
    private HttpHeaders headers;
    private String authToken;
    @BeforeEach
    public void setUp() {
        baseUrl = "http://localhost:" + port + "/api/v1";
        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        restTemplate=new TestRestTemplate();
        // Authenticate and get token before tests
        login();
    }

    public void login() {
        String loginUrl = baseUrl + "/auth/login";

        // Create login request body (adjust credentials as needed)
        //String loginBody = "{\"username\":\"hamzajdaidi\",\"password\":\"manager123\"}";
        LoginRequestDTO loginRequestDTO=new LoginRequestDTO("hamzajdaidi","manager123");
        HttpEntity<LoginRequestDTO> request = new HttpEntity<>(loginRequestDTO, headers);
        ResponseEntity<Map<String,Object>> response = restTemplate.exchange(
                loginUrl, HttpMethod.POST, request, new ParameterizedTypeReference<Map<String,Object
                        >>(){});
        System.out.println(response.getBody());
        Map<String,String> loginResponseDTO= (Map<String, String>) response.getBody().get("data");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(loginRequestDTO);

        // Extract and store the auth token for subsequent requests
        authToken = loginResponseDTO.get("accessToken");
        headers.setBearerAuth(authToken);
    }
    @Test
    public void testGetOldProjects() {
        String url = baseUrl + "/user/associate/projects/old?pageNumber=0";

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, request, new ParameterizedTypeReference<Map<String, Object>>() {});

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        // Extract and verify projects data
        assertNotNull(response.getBody().get("data"));
    }
    @Test
    public void testGetCurrentProjects() {
        String url = baseUrl + "/user/associate/projects/current";

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, request, new ParameterizedTypeReference<Map<String, Object>>() {});

        assertTrue(HttpStatus.OK==response.getStatusCode() || response.getStatusCode()==HttpStatus.NOT_FOUND);

    }
    @Test
    public void testGetProjectDetails() {
        String url = baseUrl + "/user/associate/projects/a6d7e8f7-8901-b2c3-d4e5-f67890a7d8e9";

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, request, new ParameterizedTypeReference<Map<String, Object>>() {});

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("success", response.getBody().get("status"));

        // Extract and verify project details
        assertNotNull(response.getBody().get("data"));
    }
    @Test
    public void testSearchProjects() {
        String url = baseUrl + "/user/associate/projects/byLabel?label=Pro&pageNumber=0";

        // Add query parameters if needed
        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, request, new ParameterizedTypeReference<Map<String, Object>>() {});

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("success", response.getBody().get("status"));

        // Extract and verify search results
        assertNotNull(response.getBody().get("data"));
    }
    @Test
    public void testGetProjectsCount() {
        String url = baseUrl + "/user/associate/projects/count";

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, request, new ParameterizedTypeReference<Map<String, Object>>() {});

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("success", response.getBody().get("status"));

        // Extract and verify count data
        Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
        assertNotNull(data);

    }

    @Test
    public void testGetClientProjects() {
        String url = baseUrl + "/user/associate/projects/byClient?pageNumber=0&clientId=e5f67890-a5d6-e7f7-8901-b2c3d4e5f678";

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, request, new ParameterizedTypeReference<Map<String, Object>>() {});

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("success", response.getBody().get("status"));

        // Extract and verify client projects data
        assertNotNull(response.getBody().get("data"));
    }
    @Test
    public void testPostRotationRequest() {
        String url = baseUrl + "/user/associate/report/rotation-request";

        // Create rotation request body
        CreateAssociateReportDTO requestBody = new CreateAssociateReportDTO("test1 report msg","test1 report reason", ReportType.REQUEST_ROTATION);

        HttpEntity<CreateAssociateReportDTO> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.POST, request, new ParameterizedTypeReference<Map<String, Object>>() {});

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("success", response.getBody().get("status"));

        // Extract and verify rotation request response
        assertNotNull(response.getBody().get("data"));
    }
    @Test
    public void testPostAssociateDetails() {
        String url = baseUrl + "/user/associate/8bf4fbbf-3667-4bea-9628-203ad6882ece";

        // Create associate details update body
 // Replace with actual fields

        HttpEntity<String> request = new HttpEntity<>( headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, request, new ParameterizedTypeReference<Map<String, Object>>() {});

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("success", response.getBody().get("status"));

        // Extract and verify associate details response
        assertNotNull(response.getBody().get("data"));
    }

}
