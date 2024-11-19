package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.UserAccountRequest;
import com.example.backend.respone.AuthRespone;
import com.example.backend.serviceImpl.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/admin/user")
@Tag(name = "Product API")
public class AdminUserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/createUserAccount")
    public ResponseEntity<AuthRespone> createUserAccount(@RequestBody UserAccountRequest userAccountRequest, @RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        AuthRespone authRespone = userService.createUserAccount(userAccountRequest);
        return new ResponseEntity<>(authRespone, HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<User>> getAllUserAccount(@RequestHeader("Authorization") String jwt) throws Exception{
        List<User> users = userService.getAllUser();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> deleteUserAccount(@RequestHeader("Authorization") String jwt,
                                                        @PathVariable String id) throws Exception{
        userRepository.deleteById(id);
        return new ResponseEntity<>("Delete success",HttpStatus.OK);
    }
}
