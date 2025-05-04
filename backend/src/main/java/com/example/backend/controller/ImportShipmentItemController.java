package com.example.backend.controller;

import com.example.backend.model.ImportShipment;
import com.example.backend.model.ImportShipmentItem;
import com.example.backend.model.User;
import com.example.backend.service.ImportShipmentItemService;
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
@RequestMapping("/api/importShipmentItems")
public class ImportShipmentItemController {

    @Autowired
    private ImportShipmentItemService service;
    @Autowired
    private UserService userService;

    
    @GetMapping
    public ResponseEntity<List<ImportShipmentItem>> getAllImportShipmentItems(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<ImportShipmentItem> listitem = service.getAllImportShipmentItems();
        return new ResponseEntity<>(listitem, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImportShipmentItem> getImportShipmentItem(@PathVariable String id, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        ImportShipmentItem item = service.getImportShipmentItemById(id);
        return new ResponseEntity<>(item, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ImportShipmentItem>> searchImportShipmentItems(@RequestParam String productName, @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        List<ImportShipmentItem> list = service.searchImportShipmentItems(productName);
        return ResponseEntity.ok(list);
    }
}
