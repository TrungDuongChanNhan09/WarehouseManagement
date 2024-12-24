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

    @PostMapping("/admin")
    public ResponseEntity<ImportShipmentItem> createImportShipmentItem(@RequestBody ImportShipmentItem item, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        ImportShipmentItem importitem = service.createImportShipmentItem(item);
        return new ResponseEntity<>(importitem, HttpStatus.OK);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ImportShipmentItem> updateImportShipmentItem(@PathVariable String id, @RequestBody ImportShipmentItem item,@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        ImportShipmentItem importitem = service.updateImportShipmentItem(id, item);
        return new ResponseEntity<>(importitem, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImportShipmentItem> getImportShipmentItem(@PathVariable String id, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        service.deleteImportShipmentItem(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<List<ImportShipmentItem>> getAllImportShipmentItems(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<ImportShipmentItem> listitem = service.getAllImportShipmentItems();
        return new ResponseEntity<>(listitem, HttpStatus.OK);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteImportShipmentItem(@PathVariable String id ,@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        service.deleteImportShipmentItem(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/search")
    public ResponseEntity<List<ImportShipmentItem>> searchImportShipmentItems(@RequestParam String productName, @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        List<ImportShipmentItem> list = service.searchImportShipmentItems(productName);
        return ResponseEntity.ok(list);
    }
}
