package com.example.backend.model;

import lombok.Data;

import java.lang.reflect.Array;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("inventories")
public class Inventory {
    @Id
    private String id;
    private String typeInventory;
    private String nameInventory;
    private String typeInventoryDescription;
    private INVENTORY_STATE status = INVENTORY_STATE.OPEN;
    private int quantity = 0;
    private int number_coloum;
    private int number_row;
    private int number_shelf;
    private int capacity_shelf;
}
