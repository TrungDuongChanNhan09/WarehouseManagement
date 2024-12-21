package com.example.backend.serviceImpl;

import com.example.backend.model.Inventory;
import com.example.backend.model.Shelf;
import com.example.backend.repository.InventoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class InventoryService implements com.example.backend.service.InventoryService{
    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public List<Inventory> getAllInventories(){
        return inventoryRepository.findAll();
    }

    @Override
    public void addInventory(Inventory item) throws Exception {
        Inventory existingInventory = inventoryRepository.findByinventoryName(item.getNameInventory());
        if(existingInventory != null)
            throw new Exception("Inventory is already exist");
        else
            inventoryRepository.save(item);
    }

    @Override
    public void updateInventory(String inventoryId, Inventory updatedInventory) throws Exception {
        Inventory existingInventory = inventoryRepository.findById(inventoryId).orElse(null);
        if (existingInventory == null) {
            throw new Exception("Inventory not found");
        }
        else{
            existingInventory.setNameInventory(updatedInventory.getNameInventory());
            existingInventory.setTypeInventory(updatedInventory.getTypeInventory());
            existingInventory.setShelves(updatedInventory.getShelves());
            existingInventory.setImportdate(updatedInventory.getImportdate());
            existingInventory.setTypeInventoryDescription(updatedInventory.getTypeInventoryDescription());
            this.inventoryRepository.save(existingInventory);
        }
    }
    
    @Override
    public void updateInventoryQuantity(String inventoryId){
        Inventory inventory = inventoryRepository.findById(inventoryId)
        .orElseThrow(() -> new IllegalArgumentException("Inventory not found with id: " + inventoryId));

        int totalQuantity = calculateNewQuantity(inventoryId);
        inventory.setQuantity(totalQuantity);

        inventoryRepository.save(inventory);
    }
    @Override
    public void deleteInventory(String inventoryId){
        inventoryRepository.deleteById(inventoryId);
    }

    @Override
    public Optional<Inventory> getInventoryById(String inventoryId){
        return inventoryRepository.findById(inventoryId);
    }

    @Override
    public boolean inventoryExists(String inventoryId){
        return inventoryRepository.existsById(inventoryId);
    }

    @Override
    public void updateInventoryStatus(String inventoryId, String status) throws Exception {
        Inventory existingInventory = inventoryRepository.findById(inventoryId).orElse(null);
        if(existingInventory == null){
            throw new Exception("Inventory not exists");
        }
        else{
            existingInventory.setStatus(status);
            inventoryRepository.save(existingInventory);
        }
    }

    @Override
    public List<Inventory> searchInventoriesByName(String keyword){
        Inventory inventory = new Inventory();
        inventory.setNameInventory(keyword);
        ExampleMatcher matcher = ExampleMatcher.matchingAny()
                .withMatcher("nameInventory", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase());
        Example<Inventory> example = Example.of(inventory, matcher);
        return this.inventoryRepository.findAll(example);
    }

    @Override
    public List<Inventory> filterInventoriesByType(String type){
        List<Inventory> allInventories = inventoryRepository.findAll();
    
        return allInventories.stream()
                            .filter(inventory -> type.equals(inventory.getTypeInventory()))
                            .collect(Collectors.toList());
    }


    @Override
    public int getInventoryQuantity(String inventoryId){
        return inventoryRepository.findQuantityById(inventoryId);
    }

    @Override
    public List<Inventory> getInventoriesByStatus(String status){
        return inventoryRepository.findByStatus(status);
    }

    @Override
    public List<String> getDistinctInventoryTypes() {
        return inventoryRepository.findDistinctTypeInventory();
    }

    @Override
    public int calculateNewQuantity(String inventory_id){
        List<Shelf> shelfs = inventoryRepository.findByInventoryId(inventory_id);
        int totalQuantity = 0;
        for (Shelf shelf : shelfs) {
            totalQuantity += shelf.getQuantity();
        }
        return totalQuantity;
    }
}
