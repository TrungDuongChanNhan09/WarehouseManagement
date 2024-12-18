package com.example.backend.serviceImpl;

import com.example.backend.model.Product;
import com.example.backend.model.Supplier;
import com.example.backend.repository.SupplierRepository;
import com.example.backend.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierServiceImpl implements SupplierService {
    @Autowired
    public SupplierRepository supplierRepository;

    @Override
    public Supplier addSupplier(Supplier supplier) throws Exception {
        Supplier existingSupplier = supplierRepository.findBynameSupplier(supplier.getNameSupplier());
        if(existingSupplier != null) {
            throw new Exception("Supplier is already exist");
        }
        return supplierRepository.save(supplier);
    }

    @Override
    public Supplier updateSupplier(Supplier supplier, String supplierId) throws Exception {
        Supplier existingSupplier = this.supplierRepository.findById(supplierId).orElse(null);
        if(existingSupplier == null) {
            throw new Exception("Supplier not found...");
        } else {
            existingSupplier.setNameSupplier(supplier.getNameSupplier());
            existingSupplier.setAddress(supplier.getAddress());
            existingSupplier.setEmail(supplier.getEmail());
            existingSupplier.setPhoneNumber(supplier.getPhoneNumber());
        }
        return this.supplierRepository.save(existingSupplier);
    }

    @Override
    public void deleteSupplier(String id) {
        supplierRepository.deleteById(id);
    }

    @Override
    public List<Supplier> filterSupplier(String supplierName) {
        Supplier supplier = new Supplier();
        supplier.setNameSupplier(supplierName);
        ExampleMatcher matcher = ExampleMatcher.matchingAny()
                .withMatcher("supplierName", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase());
        Example<Supplier> example = Example.of(supplier, matcher);
        return this.supplierRepository.findAll(example);
    }

    @Override
    public Optional<Supplier> getSupplierById(String id) {
        return supplierRepository.findById(id);
    }

    @Override
    public List<Supplier> getAllSupplier() {
        return supplierRepository.findAll();
    }


}
