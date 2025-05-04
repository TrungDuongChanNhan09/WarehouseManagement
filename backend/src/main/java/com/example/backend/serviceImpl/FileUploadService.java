package com.example.backend.serviceImpl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.example.backend.service.CloudinaryImage;

@Service
public class FileUploadService implements CloudinaryImage {
    @Autowired 
    private Cloudinary cloudinary;

    @Override
    public Map<String, Object> upload(MultipartFile file){
        try {
            Map<String, Object> data = this.cloudinary.uploader().upload(file.getBytes(), Map.of());
            return data;
        }catch(Exception e){
            throw new RuntimeException("Tải ảnh lên Cloudinary thất bại");
        }
    }
}
