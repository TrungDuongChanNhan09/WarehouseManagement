package com.example.backend.serviceImpl;

import java.util.List;
import java.util.Optional;

import com.example.backend.model.INVENTORY_STATE;
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
        List<Shelf> shelfs = shelfRepository.findByproductId(shelf.getProductId());
        Inventory inventory = inventoryRepository.findById(shelf.getInventoryid()).orElse(null);
        if(inventory == null){
            throw new Exception("Inventory no have");
        }
        else{
            if(inventory.getStatus() == INVENTORY_STATE.CLOSE){
                throw new Exception("INVENTORY CLOSE");
            }
            List<Shelf> shelfs_inventory = shelfRepository.findByinventoryid(shelf.getInventoryid());
            if(shelfs_inventory.size() + 1 > inventory.getNumber_shelf()){
                throw new Exception("Inventory không thể lưu thêm shelfs nữa");
            }
            
            shelf.setCapacity(inventory.getCapacity_shelf());
        }

        if(shelfs == null){
            if(shelf.getQuantity() <= inventory.getCapacity_shelf() && productRepository.findById(shelf.getProductId()).get().getInventory_quantity() >= shelf.getQuantity()){
                inventory.setQuantity(shelf.getQuantity());
                inventoryRepository.save(inventory);
                return shelfRepository.save(shelf);
            }
            else {
                throw new Exception("Product quantity is not sufficient");
            }
        }
        else{
            int totalQuantity = 0;
            for(Shelf i : shelfs){
                totalQuantity += i.getQuantity();
            }
            if(productRepository.findById(shelf.getProductId()).get().getInventory_quantity() - totalQuantity >= shelf.getQuantity() ){
                
                inventory.setQuantity(inventory.getQuantity() + shelf.getQuantity());
                inventoryRepository.save(inventory);
                return shelfRepository.save(shelf);
            }
            else {
                throw new Exception("Product quantity is not sufficient");
            }
        }
    }

    @Override
    public Shelf updateShelf(String shelfId, Shelf updatedShelf) throws Exception {

        Shelf existingShelf = shelfRepository.findById(shelfId).orElse(null);
        
        if (existingShelf != null) {
            Inventory inventory = inventoryRepository.findById(existingShelf.getInventoryid()).orElse(null);
            if(inventory.getStatus() == INVENTORY_STATE.CLOSE){
                throw new Exception("INVENTORY CLOSE");
            }
            List<Shelf> shelfs = shelfRepository.findByproductId(existingShelf.getProductId());
            int totalQuantity = 0;
            for(Shelf i : shelfs){
                totalQuantity += i.getQuantity();
            }
            if(updatedShelf.getQuantity() <= existingShelf.getCapacity() &&productRepository.findById(updatedShelf.getProductId()).get().getInventory_quantity() - totalQuantity >= updatedShelf.getQuantity() ){
                updatequantityShelf(shelfId,updatedShelf.getQuantity());
                existingShelf.setCodeShelf(updatedShelf.getCodeShelf());
                return shelfRepository.save(existingShelf);
 
            }
            else {
                throw new Exception("Product quantity is not sufficient");
            }
            
            
        } else {
            throw new Exception("Shelf with ID " + shelfId + " not found");
        }
    }

    @Override
    public void deleteShelf(String shelfId){
        Inventory inventory = inventoryRepository.findById(shelfRepository.findById(shelfId).get().getInventoryid()).orElse(null);
        if(inventory != null){
            inventory.setQuantity(inventory.getQuantity()-shelfRepository.findById(shelfId).get().getQuantity());
            inventoryRepository.save(inventory);
        }
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
    public List<Shelf> searchShelfByCode(String keyword){
        return shelfRepository.searchBycodeShelf(keyword);
    }

    @Override
    public void updatequantityShelf(String shelfId, int quantity) throws Exception{
        Shelf shelf = shelfRepository.findById(shelfId).orElse(null);
        if (shelf != null) {
            Inventory inventory = inventoryRepository.findById(shelf.getInventoryid()).orElse(null);
            if(inventory.getStatus() == INVENTORY_STATE.CLOSE){
                throw new Exception("INVENTORY CLOSE");
            }
            int totalQuantitybefore = shelf.getQuantity();
            shelf.setQuantity(quantity);

            if(inventory != null){
                int sub_quantity = quantity - totalQuantitybefore;
                int quantity_inventory = inventory.getQuantity() + sub_quantity;
                inventory.setQuantity(quantity_inventory);
                inventoryRepository.save(inventory);
            }
        }
    }
}
