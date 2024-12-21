package com.example.backend.service;

import java.util.List;
import java.util.Optional;

import com.example.backend.model.Shelf;

public interface ShelfService {
    List<Shelf> getShelvesByInventory(String inventoryId);
    void addShelf(Shelf shelf) throws Exception;
    void updateShelf(String shelfId, Shelf updatedShelf) throws Exception;
    void deleteShelf(String shelfId);

    int calculateNewQuantity(Shelf shelf);
    void updatequantityShelf(String shelfId);

    Optional<Shelf> getShelfById(String shelfId);
    boolean shelfExists(String shelfId);
    List<Shelf> getAllShelves();
}
