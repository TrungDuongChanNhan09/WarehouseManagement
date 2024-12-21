package com.example.backend.serviceImpl;

import java.util.List;
import java.util.Optional;

import com.example.backend.model.Inventory;
import com.example.backend.model.Product;
import com.example.backend.model.Shelf;
import com.example.backend.repository.InventoryRepository;
import com.example.backend.repository.ShelfRepository;

import org.springframework.beans.factory.annotation.Autowired;
public class ShelfService implements com.example.backend.service.ShelfService{
    @Autowired
    private ShelfRepository shelfRepository;
    
    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public List<Shelf> getShelvesByInventory(String inventoryId) {
        return shelfRepository.findByInventoryId(inventoryId);
    }
    @Override
    public void addShelf(Shelf shelf) throws Exception {
        Shelf existingInventory = shelfRepository.findByshelfid(shelf.getShelf_id());
        if(existingInventory != null)
            throw new Exception("Shelf is already exist");
        else
            shelfRepository.save(shelf);
    }

    @Override
    public void updateShelf(String shelfId, Shelf updatedShelf) throws Exception {

        Shelf existingShelf = shelfRepository.findById(shelfId).orElse(null);
        if (existingShelf != null) {
            existingShelf.setInventory_id(updatedShelf.getInventory_id());
            existingShelf.setProductId(updatedShelf.getProductId());
            existingShelf.setQuantity(updatedShelf.getQuantity());
            shelfRepository.save(existingShelf);
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
    public int calculateNewQuantity(Shelf shelf){
        List<Product> products = shelfRepository.findProductsByProductIds(shelf.getProductId());
        int totalQuantity = 0;
        for (Product product : products) {
            totalQuantity += product.getInventory_quantity();
        }
        return totalQuantity;
    }

    @Override
    public void updatequantityShelf(String shelfId){
        Shelf shelf = shelfRepository.findById(shelfId).orElse(null);
        if (shelf != null) {
            int totalQuantitybefore = shelf.getQuantity();
            int totalQuantity = calculateNewQuantity(shelf);
            shelf.setQuantity(totalQuantity);
            shelfRepository.save(shelf);
            
            Inventory inventory = inventoryRepository.findById(shelf.getInventory_id()).orElse(null);
            if(inventory != null){
                int sub_quantity = totalQuantity - totalQuantitybefore;
                int quantity_inventory = inventory.getQuantity() + sub_quantity;
                inventory.setQuantity(quantity_inventory);
                inventoryRepository.save(inventory);
            }
        }
    }
}
