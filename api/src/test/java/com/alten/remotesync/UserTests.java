package com.alten.remotesync;

import com.alten.remotesync.application.user.record.request.LoginRequestDTO;
import com.alten.remotesync.application.user.record.response.LoginResponseDTO;
import com.alten.remotesync.application.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserTests {

    @Autowired
    private UserService userService;
@Test
    public void testLogin(){
    LoginResponseDTO loginResponseDTO=userService.login(new LoginRequestDTO("testname","12345"));
    System.out.println(loginResponseDTO.accessToken());
    assertThat(loginResponseDTO).isNotNull();

}
}
