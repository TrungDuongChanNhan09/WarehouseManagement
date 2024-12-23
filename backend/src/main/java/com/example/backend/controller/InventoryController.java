package com.example.backend.controller;

import com.example.backend.model.Inventory;
import com.example.backend.model.User;
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

    @DeleteMapping("/{inventoryId}")
    public ResponseEntity<Void> deleteInventory(@PathVariable String inventoryId, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        inventoryService.deleteInventory(inventoryId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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

}
