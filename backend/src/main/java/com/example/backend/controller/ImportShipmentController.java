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
@RequestMapping("/api/importshipments")
public class ImportShipmentController {

    @Autowired
    private ImportShipmentService importShipmentService;
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<ImportShipment>> getAllImportShipments(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return ResponseEntity.ok(importShipmentService.getAllImportShipments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImportShipment> getImportShipmentById(@PathVariable String id, @RequestHeader("Authorization") String jwt) throws Exception  {
        User user = userService.findUserByJwtToken(jwt);
        return ResponseEntity.ok(importShipmentService.getImportShipmentById(id));
    }

    @GetMapping("/{importshipmentId}/shelf")
    public ResponseEntity<List<ImportShipmentItem>> getImportShipmentItemsByImportShipmentId(
            @PathVariable String importshipmentId, @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        List<ImportShipmentItem> items = importShipmentService.getImportShipmentItemsByImportShipmentId(importshipmentId);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/admin")
    public ResponseEntity<ImportShipment> createImportShipment(@RequestBody ImportShipment importShipment, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return ResponseEntity.ok(importShipmentService.createImportShipment(importShipment));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ImportShipment> updateImportShipment(@PathVariable String id, @RequestBody ImportShipment updatedShipment, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return ResponseEntity.ok(importShipmentService.updateImportShipment(id, updatedShipment));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteImportShipment(@PathVariable String id, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        importShipmentService.deleteImportShipment(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{importShipmentId}/total-cost")
    public ResponseEntity<BigDecimal> getImportShipmentTotalCost(
            @PathVariable String importShipmentId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        BigDecimal totalCost = importShipmentService.getImportShipmentTotalCost(importShipmentId);
        return ResponseEntity.ok(totalCost);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ImportShipment>> getImportShipmentsByDateRange(
        @RequestParam String startDate, 
        @RequestParam String endDate, 
        @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        LocalDate start = LocalDate.parse(startDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        LocalDate end = LocalDate.parse(endDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        
        List<ImportShipment> shipments = importShipmentService.getImportShipmentsByDateRange(start, end);
        return ResponseEntity.ok(shipments);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ImportShipment>> searchImportShipmentsBySupplier(@RequestParam String supplier, @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        List<ImportShipment> list = importShipmentService.searchImportShipmentsBysuppiler(supplier);
        return ResponseEntity.ok(list);
    }

}
