package com.example.backend.serviceImpl;

import java.util.List;
import java.util.Optional;

import com.example.backend.model.Inventory;
import com.example.backend.model.Product;
import com.example.backend.model.Shelf;
import com.example.backend.repository.InventoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ShelfRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShelfService implements com.example.backend.service.ShelfService{
    @Autowired
    private ShelfRepository shelfRepository;
    
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Shelf> getShelvesByInventory(String inventoryId) {
        return shelfRepository.findByinventoryid(inventoryId);
    }
    @Override
    public Shelf addShelf(Shelf shelf) throws Exception {
        Shelf existingInventory = shelfRepository.findById(shelf.getId()).orElse(null);
        if(existingInventory != null)
            throw new Exception("Shelf is already exist");
        else
            return shelfRepository.save(shelf);
    }

    @Override
    public Shelf updateShelf(String shelfId, Shelf updatedShelf) throws Exception {

        Shelf existingShelf = shelfRepository.findById(shelfId).orElse(null);
        if (existingShelf != null) {
            existingShelf.setInventoryid(updatedShelf.getInventoryid());
            existingShelf.setProductId(updatedShelf.getProductId());
            updatequantityShelf(shelfId,updatedShelf.getQuantity());
            return shelfRepository.save(existingShelf);
        } else {
            throw new Exception("Shelf with ID " + shelfId + " not found");
        }
    }

    @Override
    public void deleteShelf(String shelfId){
        shelfRepository.deleteById(shelfId);
    }

    @Override
    public Optional<Shelf> getShelfById(String shelfId){
        return shelfRepository.findById(shelfId);
    }

    @Override
    public boolean shelfExists(String shelfId) {
        return shelfRepository.existsById(shelfId);
    }

    @Override
    public List<Shelf> getAllShelves() {
        return shelfRepository.findAll();
    }


    @Override
    public void updatequantityShelf(String shelfId, int quantity){
        Shelf shelf = shelfRepository.findById(shelfId).orElse(null);
        if (shelf != null) {
            int totalQuantitybefore = shelf.getQuantity();
            int totalQuantity = quantity + totalQuantitybefore;
            shelf.setQuantity(totalQuantity);

            Inventory inventory = inventoryRepository.findById(shelf.getInventoryid()).orElse(null);
            if(inventory != null){
                int sub_quantity = totalQuantity - totalQuantitybefore;
                int quantity_inventory = inventory.getQuantity() + sub_quantity;
                inventory.setQuantity(quantity_inventory);
                inventoryRepository.save(inventory);
            }
        }
    }
}
