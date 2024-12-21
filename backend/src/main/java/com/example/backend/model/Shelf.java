package com.example.backend.model;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
@Data
@Document(
    "shelf"
)
public class Shelf {
    @Id
    private String shelf_id;
    private String inventory_id;
    private List<String> productId;
    private int quantity;
}
