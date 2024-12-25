package com.example.backend.controller;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

import com.example.backend.model.Category;
import com.example.backend.serviceImpl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.backend.config.JwtProvider;
import com.example.backend.model.USER_ROLE;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.LoginRequest;
import com.example.backend.respone.AuthRespone;
import com.example.backend.serviceImpl.CustomerUserDetailsService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication API")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtProvider jwtProvider;
    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    private UserService userService;


    @PostMapping("/signup")
    public ResponseEntity<AuthRespone> createUserHandler(@RequestBody User user) throws Exception {
        User isUserNameExist = userRepository.findByuserName(user.getUserName());
        if(isUserNameExist != null){
            throw new Exception("Username is already used by another user");
        }

        User createdUser = new User();
        createdUser.setUserName(user.getUserName());
        createdUser.setEmail(user.getEmail());
        createdUser.setFullName(user.getFullName());
        createdUser.setRole(user.getRole());
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(createdUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt =  jwtProvider.generatedToken(authentication);

        AuthRespone authRespone = new AuthRespone();
        authRespone.setJwt(jwt);
        authRespone.setRole(savedUser.getRole());
        authRespone.setMessage("Register success");

        return new ResponseEntity<>(authRespone, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthRespone> signin(@RequestBody LoginRequest request) throws Exception {
        String username = request.getUserName();
        String password = request.getPassword();

        Authentication authentication = authenticate(username, password);

        User user = userRepository.findByuserName(username);
        if(Objects.equals(user.getStatus(), "on")){
            throw new Exception("User is already login");
        }
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty()?null:authorities.iterator().next().getAuthority();

        String jwt =  jwtProvider.generatedToken(authentication);

        AuthRespone authRespone = new AuthRespone();
        authRespone.setJwt(jwt);
        authRespone.setRole(USER_ROLE.valueOf(role));
        authRespone.setMessage("Sign in success");
        user.setStatus("on");
        userRepository.save(user);

        return new ResponseEntity<>(authRespone, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);

        user.setStatus("off");
        userRepository.save(user);
        return new ResponseEntity<>("Successfully logged out", HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

        if(userDetails == null){
            throw new BadCredentialsException("Invalid username....");
        }

        if(!passwordEncoder.matches(password,userDetails.getPassword())){
            throw new BadCredentialsException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails,
                null, userDetails.getAuthorities());
    }
}
