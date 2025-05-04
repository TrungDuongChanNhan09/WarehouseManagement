package com.example.backend.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryImage {
    public Map upload(MultipartFile file);
}
