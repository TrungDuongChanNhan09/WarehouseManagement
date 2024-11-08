package com.example.backend.serviceImpl;

import com.example.backend.config.JwtProvider;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.LoginRequest;
import com.example.backend.request.UserAccountRequest;
import com.example.backend.request.UserInforRequest;
import com.example.backend.respone.AuthRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class UserService implements com.example.backend.service.UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String username = jwtProvider.getUserNameFromJwtToken(jwt);
        User user = findUserByUserName(username);
        return user;
    }

    @Override
    public User findUserByUserName(String username) throws Exception {
        User user = userRepository.findByuserName(username);

        if(user == null){
            throw new Exception("user not found..." + username);
        }
        return user;
    }

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public User updateUserInformation(UserInforRequest userInforRequest, User user) {
        user.setGender(userInforRequest.getGender());
        user.setDateOfBirth(userInforRequest.getDateOfBirth());
        user.setIdentification(userInforRequest.getIdentification());
        user.setAddress(userInforRequest.getAddress());
        user.setEmail(userInforRequest.getEmail());
        return userRepository.save(user);
    }

    @Override
    public AuthRespone createUserAccount(UserAccountRequest userAccountRequest) throws Exception {
        User isEmailExist = userRepository.findByuserName(userAccountRequest.getUsername());
        if (isEmailExist != null) {
            throw new Exception("Username is already used by another user");
        }

        User createdUser = new User();
        createdUser.setUserName(userAccountRequest.getUsername());
        createdUser.setFullName(userAccountRequest.getFullName());
        createdUser.setRole(userAccountRequest.getRole());
        createdUser.setPassword(passwordEncoder.encode(userAccountRequest.getPassword()));

        User savedUser = userRepository.save(createdUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(userAccountRequest.getUsername(), userAccountRequest.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generatedToken(authentication);

        AuthRespone authRespone = new AuthRespone();
        authRespone.setJwt(jwt);
        authRespone.setRole(savedUser.getRole());
        authRespone.setMessage("Create Success");
        return authRespone;
    }


}
