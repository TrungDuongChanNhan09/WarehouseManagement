package com.example.backend.respone;

import lombok.Data;
import java.util.List;
import java.util.ArrayList;

@Data
public class ShelfEmpty {
    private String inventoryId;
    private List<ShelfPosition> position = new ArrayList<>();
}
