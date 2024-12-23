package com.example.backend.controller;
import com.example.backend.model.Shelf;
import com.example.backend.model.User;
import com.example.backend.service.ShelfService;
import com.example.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/shelf")

public class ShelfController {
    @Autowired
    private ShelfService shelfService;
    @Autowired
    private UserService userService;

    @GetMapping("/inventory/{inventoryId}")
    public ResponseEntity<List<Shelf>> getShelvesByInventory(@PathVariable String inventoryId, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Shelf> shelves = shelfService.getShelvesByInventory(inventoryId);
        return new ResponseEntity<>(shelves, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<Shelf> addShelf(@RequestBody Shelf shelf, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Shelf createdShelf = shelfService.addShelf(shelf);
        return new ResponseEntity<>(createdShelf, HttpStatus.CREATED);
    }

    @PutMapping("/{shelfId}")
    public ResponseEntity<Shelf> updateShelf(@PathVariable String shelfId, @RequestBody Shelf updatedShelf, @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        Shelf updated = shelfService.updateShelf(shelfId, updatedShelf);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{shelfId}")
    public ResponseEntity<Void> deleteShelf(@PathVariable String shelfId, @RequestHeader("Authorization") String jwt) throws Exception{
        
        User user = userService.findUserByJwtToken(jwt);
        shelfService.deleteShelf(shelfId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{shelfId}")
    public ResponseEntity<Shelf> getShelfById(@PathVariable String shelfId, @RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);

        Optional<Shelf> shelf = shelfService.getShelfById(shelfId);
        return shelf.map(s -> new ResponseEntity<>(s, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @GetMapping("/all")
    public ResponseEntity<List<Shelf>> getAllShelves(@RequestHeader("Authorization") String jwt) throws Exception{
        
        User user = userService.findUserByJwtToken(jwt);
        List<Shelf> shelves = shelfService.getAllShelves();
        return new ResponseEntity<>(shelves, HttpStatus.OK);
    }
}
