package com.example.backend.service;

import java.util.List;
import java.util.Optional;

import com.example.backend.model.Inventory;
import com.example.backend.model.Shelf;

public interface ShelfService {
    List<Shelf> getShelvesByInventory(String inventoryId);
    Shelf addShelf(Shelf shelf) throws Exception;
    Shelf updateShelf(String shelfId, Shelf updatedShelf) throws Exception;
    void deleteShelf(String shelfId);

    void updatequantityShelf(String shelfId, int quantity) throws Exception;

    List<Shelf> searchShelfByCode(String keyword);
    Optional<Shelf> getShelfById(String shelfId);
    boolean shelfExists(String shelfId);
    List<Shelf> getAllShelves();
}
