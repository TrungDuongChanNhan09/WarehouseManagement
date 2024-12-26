package com.example.backend.controller;

import com.example.backend.model.Inventory;
import com.example.backend.model.User;
import com.example.backend.request.InventoryStatus;
import com.example.backend.service.InventoryService;
import com.example.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/inventory")
public class AdminInventoryController {
    @Autowired
    private InventoryService inventoryService;
    @Autowired
    private UserService userService;

    @PostMapping("")
    public ResponseEntity<Inventory> addInventory(@RequestBody Inventory inventory, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Inventory createdInventory = inventoryService.addInventory(inventory);
        return new ResponseEntity<>(createdInventory, HttpStatus.CREATED);
    }

    @PutMapping("/{inventoryId}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable String inventoryId, @RequestBody Inventory updatedInventory, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Inventory updated = inventoryService.updateInventory(inventoryId, updatedInventory);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
    @PutMapping("/status/{inventoryId}")
    public ResponseEntity<Inventory> updateInventoryStatus(@PathVariable String inventoryId, @RequestBody InventoryStatus status, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Inventory updated = inventoryService.updateInventoryStatus(inventoryId, status);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{inventoryId}")
    public ResponseEntity<Void> deleteInventory(@PathVariable String inventoryId, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        inventoryService.deleteInventory(inventoryId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
