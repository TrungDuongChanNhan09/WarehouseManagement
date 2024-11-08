package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.request.LoginRequest;
import com.example.backend.request.UserAccountRequest;
import com.example.backend.request.UserInforRequest;
import com.example.backend.respone.AuthRespone;

import java.util.List;

public interface UserService {
    public User findUserByJwtToken(String jwt) throws Exception;

    public User findUserByUserName(String username) throws Exception;

    public List<User> getAllUser();

    public User updateUserInformation(UserInforRequest userInforRequest, User user);

    public AuthRespone createUserAccount(UserAccountRequest userAccountRequest) throws Exception;

}
