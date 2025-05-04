package com.example.backend.controller;

import com.example.backend.model.Supplier;
import com.example.backend.model.User;
import com.example.backend.request.SupplierRequest;
import com.example.backend.service.SupplierService;
import com.example.backend.serviceImpl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/supplier")
public class AdminSupplierController {
    @Autowired
    public UserService userService;

    @Autowired
    public SupplierService supplierService;

    @PostMapping("")
    public ResponseEntity<Supplier> addSupplier(@RequestBody SupplierRequest supplier, @RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        Supplier newSupplier = supplierService.addSupplier(supplier);
        return new ResponseEntity<>(newSupplier, HttpStatus.CREATED);
    }

    @PutMapping("/updateSupplier/{id}")
    public ResponseEntity<Supplier> updateSupplier(@RequestBody SupplierRequest supplier, @RequestHeader("Authorization") String jwt, @PathVariable String id) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(supplierService.updateSupplier(supplier, id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@RequestHeader("Authorization") String jwt, @PathVariable String id) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        supplierService.deleteSupplier(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
