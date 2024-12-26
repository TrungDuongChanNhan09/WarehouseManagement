package com.example.backend.serviceImpl;
import com.example.backend.model.ImportShipmentItem;
import com.example.backend.model.Product;
import com.example.backend.model.ImportShipment;
import com.example.backend.repository.ImportShipmentItemRepository;
import com.example.backend.repository.ImportShipmentRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

@Service
public class ImportShipmentItemService implements com.example.backend.service.ImportShipmentItemService{
    @Autowired
    private ImportShipmentItemRepository importShipmentItemRepository;
    @Autowired
    private ImportShipmentRepository importShipmentRepository;
    @Override
    public ImportShipmentItem createImportShipmentItem(ImportShipmentItem item) throws Exception {
        ImportShipment importShipment = importShipmentRepository.findById(item.getImportshipmentId()).orElse(null);
        if(importShipment != null){
            ImportShipmentItem existingItem = importShipmentItemRepository.findByImportshipmentIdAndProductName(item.getImportshipmentId(), item.getProductName()).orElse(null);
            if (existingItem != null) {
                existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
                importShipmentItemRepository.save(existingItem);
                return existingItem;
            }
            importShipmentItemRepository.save(item);

            if (importShipment.getItems() == null) {
                importShipment.setItems(new ArrayList<>());
            }
            List<String> listitem = importShipment.getItems();
            listitem.add(item.getId());
            importShipment.setItems(listitem);
            importShipmentRepository.save(importShipment); 
            return item;
        }
        else{
            throw new Exception("ImportShipment not found");
        }
    }
    @Override
    public ImportShipmentItem updateImportShipmentItem(String id, ImportShipmentItem item) {
        ImportShipmentItem existingItem = importShipmentItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));
        existingItem.setProductName(item.getProductName());
        existingItem.setQuantity(item.getQuantity());
        existingItem.setTotalPrice(item.getTotalPrice());
        return importShipmentItemRepository.save(existingItem);
    }

   

    @Override
    public ImportShipmentItem getImportShipmentItemById(String id){
        return importShipmentItemRepository.findById(id).orElse(null);
    }
    @Override
    public List<ImportShipmentItem> getAllImportShipmentItems() {
        return importShipmentItemRepository.findAll();
    }
    @Override
    public void deleteImportShipmentItem(String id) {
        ImportShipmentItem importShipmentItem = importShipmentItemRepository.findById(id).orElse(null);
        if(importShipmentItem != null){
            ImportShipment importShipment = importShipmentRepository.findById(importShipmentItem.getImportshipmentId()).orElse(null);
            if(importShipment != null){
                if (importShipment.getItems() != null) {
                    importShipment.getItems().remove(importShipmentItem.getId());
                    importShipmentRepository.save(importShipment);
                }
            }
        }
        importShipmentItemRepository.deleteById(id);
    }

    @Override
    public List<ImportShipmentItem> searchImportShipmentItems(String productname) {
        return importShipmentItemRepository.searchByproductName(productname);
    }

    
}
