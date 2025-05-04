package com.example.backend.service;

import com.example.backend.model.Supplier;
import com.example.backend.request.SupplierRequest;

import java.util.List;
import java.util.Optional;

public interface SupplierService {
    public Supplier addSupplier(SupplierRequest supplier) throws Exception;

    public Supplier updateSupplier(SupplierRequest supplier, String supplierId) throws Exception;

    public void deleteSupplier(String id);

    public List<Supplier> filterSupplier(String supplierName);

    public Optional<Supplier> getSupplierById(String id);

    public List<Supplier> getAllSupplier();
}
