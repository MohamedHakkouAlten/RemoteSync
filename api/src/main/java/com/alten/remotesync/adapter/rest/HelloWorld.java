package com.alten.remotesync.adapter.rest;

import com.alten.remotesync.adapter.wrapper.ResponseWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
@RequiredArgsConstructor
public class HelloWorld {
    @GetMapping("/")
    public ResponseEntity<?> SayHelloWorld(){
        return ResponseEntity.status(HttpStatus.OK).body(ResponseWrapper.success("Hello World From Spring", HttpStatus.OK));
    }
}
