package com.example.backend.controller;

import com.example.backend.model.Supplier;
import com.example.backend.model.User;
import com.example.backend.service.SupplierService;
import com.example.backend.serviceImpl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/supplier")
public class SupplierController {
    @Autowired
    public UserService userService;

    @Autowired
    public SupplierService supplierService;

    @GetMapping("")
    public ResponseEntity<List<Supplier>> getAllSupplier(@RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(supplierService.getAllSupplier(), HttpStatus.OK);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Optional<Supplier>> getSupplierById(@RequestHeader("Authorization") String jwt, @PathVariable String id) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(supplierService.getSupplierById(id), HttpStatus.OK);
    }

    @GetMapping("/getByName/{name}")
    public ResponseEntity<List<Supplier>> getSupplierByName(@RequestHeader("Authorization") String jwt, @PathVariable String name) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        List<Supplier> suppliers = supplierService.filterSupplier(name);
        return new ResponseEntity<>(suppliers, HttpStatus.OK);
    }
}
