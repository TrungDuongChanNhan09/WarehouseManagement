package com.example.backend.controller;

import com.example.backend.model.ImportShipment;
import com.example.backend.model.ImportShipmentItem;
import com.example.backend.model.User;
import com.example.backend.service.ImportShipmentService;
import com.example.backend.serviceImpl.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/admin/importshipments")
public class AdminImportShipmentController {

    @Autowired
    private ImportShipmentService importShipmentService;
    @Autowired
    private UserService userService;

    

    @PostMapping("")
    public ResponseEntity<ImportShipment> createImportShipment(@RequestBody ImportShipment importShipment, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return ResponseEntity.ok(importShipmentService.createImportShipment(importShipment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImportShipment> updateImportShipment(@PathVariable String id, @RequestBody ImportShipment updatedShipment, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return ResponseEntity.ok(importShipmentService.updateImportShipment(id, updatedShipment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImportShipment(@PathVariable String id, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        importShipmentService.deleteImportShipment(id);
        return ResponseEntity.noContent().build();
    }

}

