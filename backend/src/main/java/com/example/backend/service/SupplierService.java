package com.example.backend.service;

import com.example.backend.model.Supplier;

import java.util.List;
import java.util.Optional;

public interface SupplierService {
    public Supplier addSupplier(Supplier supplier) throws Exception;

    public Supplier updateSupplier(Supplier supplier, String supplierId) throws Exception;

    public void deleteSupplier(String id);

    public List<Supplier> filterSupplier(String supplierName);

    public Optional<Supplier> getSupplierById(String id);

    public List<Supplier> getAllSupplier();
}
