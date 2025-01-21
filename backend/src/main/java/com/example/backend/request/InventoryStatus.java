package com.example.backend.request;

import com.example.backend.ENUM.INVENTORY_STATE;
import lombok.Data;
@Data
public class InventoryStatus {
    private INVENTORY_STATE status;
}

