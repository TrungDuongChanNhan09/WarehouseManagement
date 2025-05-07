package com.example.backend.serviceImpl;

import com.example.backend.ENUM.INVENTORY_STATE;
import com.example.backend.model.Inventory;
import com.example.backend.model.Shelf;
import com.example.backend.repository.InventoryRepository;
import com.example.backend.repository.ShelfRepository;
import com.example.backend.request.InventoryStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventoryService implements com.example.backend.service.InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private ShelfRepository shelfRepository;

    @Override
    public List<Inventory> getAllInventories() {
        return inventoryRepository.findAll();
    }

    @Override
    public Inventory addInventory(Inventory item) throws Exception {
        Inventory existingInventory = inventoryRepository.findBynameInventory(item.getNameInventory());
        if (existingInventory != null)
            throw new Exception("Inventory is already exist");
        else {
            if(item.getNumber_coloum() < 1 || item.getNumber_row() < 1 ){
                throw new Exception("Yêu cầu hàng hoặc cột không được bé hơn 1 ");
            }
            item.setNumber_shelf(item.getNumber_coloum() * item.getNumber_row());
            return inventoryRepository.save(item);
        }
    }

    @Override
    public Inventory updateInventory(String inventoryId, Inventory updatedInventory) throws Exception {
        Inventory existingInventory = inventoryRepository.findById(inventoryId).orElse(null);
        if (existingInventory == null) {
            throw new Exception("Inventory not found");
        } else {

            List<Shelf> shelfs = shelfRepository.findByinventoryid(inventoryId);

            if (updatedInventory.getNumber_shelf() < shelfs.size()) {
                throw new Exception("Số lượng shelf đang chứa hàng đang lớn hơn số lượng shelf muốn sửa");
            }
            if (updatedInventory.getNumber_coloum() < 1 || updatedInventory.getNumber_row() < 1) {
                throw new Exception("Yêu cầu hàng hoặc cột không được bé hơn 1 ");
            }
            //if (updatedInventory.getNumber_coloum() < existingInventory.getNumber_coloum() || updatedInventory.getNumber_row() > existingInventory.getNumber_row()) {
             //   throw new Exception("Yêu cầu hàng hoặc cột không được bé hơn 1 ");
           // }
            existingInventory.setStatus(updatedInventory.getStatus());
            existingInventory.setNameInventory(updatedInventory.getNameInventory());
            existingInventory.setTypeInventory(updatedInventory.getTypeInventory());
            existingInventory.setTypeInventoryDescription(updatedInventory.getTypeInventoryDescription());
            existingInventory.setNumber_coloum(updatedInventory.getNumber_coloum());
            existingInventory.setNumber_row(updatedInventory.getNumber_row());
            existingInventory.setNumber_shelf(updatedInventory.getNumber_coloum() * updatedInventory.getNumber_row());
            return this.inventoryRepository.save(existingInventory);
        }
    }

    @Override
    public Inventory updateInventoryQuantity(String inventoryId) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new IllegalArgumentException("Inventory not found with id: " + inventoryId));

        int totalQuantity = calculateNewQuantity(inventoryId);
        inventory.setQuantity(totalQuantity);

        return inventoryRepository.save(inventory);
    }

    @Override
    public void deleteInventory(String inventoryId) {

        inventoryRepository.deleteById(inventoryId);
        List<Shelf> shelves = shelfRepository.findByinventoryid(inventoryId);
        for (Shelf i : shelves) {
            shelfRepository.deleteById(i.getId());
        }
    }

    @Override
    public Optional<Inventory> getInventoryById(String inventoryId) {
        return inventoryRepository.findById(inventoryId);
    }

    @Override
    public Inventory updateInventoryStatus(String inventoryId, InventoryStatus status) throws Exception {
        Inventory existingInventory = inventoryRepository.findById(inventoryId).orElse(null);
        if (status.getStatus() == INVENTORY_STATE.CLOSE && existingInventory.getQuantity() > 0) {
            throw new Exception("Không thể đóng kho vì còn sản phẩm");
        } else {
            existingInventory.setStatus(status.getStatus());
            return inventoryRepository.save(existingInventory);
        }
    }

    @Override
    public List<Inventory> searchInventoriesByName(String keyword) {
        return inventoryRepository.searchBynameInventory(keyword);
    }

    @Override
    public List<Inventory> filterInventoriesByType(String type) {
        List<Inventory> allInventories = inventoryRepository.findAll();

        return allInventories.stream()
                .filter(inventory -> type.equals(inventory.getTypeInventory()))
                .collect(Collectors.toList());
    }

    @Override
    public int getInventoryQuantity(String inventoryId) {
        return inventoryRepository.findById(inventoryId).get().getQuantity();
    }

    @Override
    public List<Inventory> getInventoriesByStatus(InventoryStatus status) {
        return inventoryRepository.findByStatus(status.getStatus());
    }

    @Override
    public List<String> getDistinctInventoryTypes() {
        List<Inventory> rawData = inventoryRepository.findAll();

        List<String> uniqueTypes = new ArrayList();

        for (Inventory inventory : rawData) {
            if (!uniqueTypes.contains(inventory.getTypeInventory())) {
                uniqueTypes.add(inventory.getTypeInventory());
            }
        }

        return uniqueTypes;
    }

    @Override
    public int calculateNewQuantity(String inventory_id) {
        List<Shelf> shelfs = shelfRepository.findByinventoryid(inventory_id);
        int totalQuantity = 0;
        for (Shelf shelf : shelfs) {
            totalQuantity += shelf.getQuantity();
        }
        return totalQuantity;
    }
}
