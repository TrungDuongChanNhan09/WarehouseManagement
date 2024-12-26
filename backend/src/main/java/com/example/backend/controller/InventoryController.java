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
@RequestMapping("/api/inventory")
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;
    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<List<Inventory>> getAllInventories(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        
        List<Inventory> inventories = inventoryService.getAllInventories();
        return new ResponseEntity<>(inventories, HttpStatus.OK);
    }


    @GetMapping("/{inventoryId}")
    public ResponseEntity<Optional<Inventory>> getInventoryById(@PathVariable String inventoryId, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Optional<Inventory> inventory = inventoryService.getInventoryById(inventoryId);
        return new ResponseEntity<>(inventory, HttpStatus.OK);
    }

    @GetMapping("/filterByType/{type}")
    public ResponseEntity<List<Inventory>> filterInventoriesByType(@PathVariable String type, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Inventory> inventories = inventoryService.filterInventoriesByType(type);
        return new ResponseEntity<>(inventories, HttpStatus.OK);
    }

    @GetMapping("/searchByName/{keyword}")
    public ResponseEntity<List<Inventory>> searchInventoriesByName(@PathVariable String keyword, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Inventory> inventories = inventoryService.searchInventoriesByName(keyword);
        return new ResponseEntity<>(inventories, HttpStatus.OK);
    }

    @GetMapping("/distinctTypes")
    public ResponseEntity<List<String>> getDistinctInventoryTypes(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<String> types = inventoryService.getDistinctInventoryTypes();
        return new ResponseEntity<>(types, HttpStatus.OK);
    }

    @GetMapping("/status")
    public ResponseEntity<List<Inventory>> getInventoriesByStatus(@RequestBody InventoryStatus status, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); 
        List<Inventory> inventories = inventoryService.getInventoriesByStatus(status);
        return ResponseEntity.ok(inventories);
    }

}
