package com.alten.remotesync.adapter.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class AdminController {

    @GetMapping({"/admin/bla"})
    public ResponseEntity<?> s(){
        return ResponseEntity.ok("");
    }

}
