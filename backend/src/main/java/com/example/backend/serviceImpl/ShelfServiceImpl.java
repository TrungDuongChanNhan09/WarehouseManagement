package com.example.backend.serviceImpl;

import com.example.backend.ENUM.INVENTORY_STATE;
import com.example.backend.model.Inventory;
import com.example.backend.model.Product;
import com.example.backend.model.Shelf;
import com.example.backend.respone.ShelfEmpty;
import com.example.backend.repository.InventoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ShelfRepository;
import com.example.backend.respone.ShelfPosition;
import com.example.backend.service.ShelfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ShelfServiceImpl implements ShelfService {
    @Autowired
    private ShelfRepository shelfRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Shelf> getAllShelves() {
        return shelfRepository.findAll();
    }

    @Override
    public List<Shelf> getShelvesByInventory(String inventoryId) {
        return shelfRepository.findByinventoryid(inventoryId);
    }

    @Override
    public Shelf addShelf(Shelf shelf) throws Exception {
        List<Shelf> shelfs = shelfRepository.findByproductId(shelf.getProductId());
        Inventory inventory = inventoryRepository.findById(shelf.getInventoryid()).orElse(null);

        if (inventory == null) {
            throw new Exception("Inventory no have");
        } else {
            if (CheckNameExistsShelf(shelf)) {
                throw new Exception("Shelf name already exists");
            }
            if (inventory.getStatus() == INVENTORY_STATE.CLOSE) {
                throw new Exception("INVENTORY CLOSE");
            }
            List<Shelf> shelfs_inventory = shelfRepository.findByinventoryid(shelf.getInventoryid());
            if (shelfs_inventory.size() + 1 > inventory.getNumber_shelf()) {
                throw new Exception("Inventory không thể lưu thêm shelfs nữa");
            }

            shelf.setCapacity(inventory.getCapacity_shelf());
        }
        String checkposition = CheckPositionExistsShelf(shelf);
        if (!((shelf.getColoum() >= 0 && shelf.getColoum() < inventory.getNumber_coloum())
                && (shelf.getRow() >= 0 && shelf.getRow() < inventory.getNumber_row()))) {
            throw new Exception("Vị trí này không tồn tại trong kho");
        } else if (checkposition == "1") {
            throw new Exception("Vị trí này thêm không được vì kệ đã có sản phẩm");
        }

        if (shelfs == null) {
            if (shelf.getQuantity() <= inventory.getCapacity_shelf() && productRepository.findById(shelf.getProductId())
                    .get().getInventory_quantity() >= shelf.getQuantity()) {
                inventory.setQuantity(shelf.getQuantity());
                inventoryRepository.save(inventory);
                return shelfRepository.save(shelf);
            } else {
                throw new Exception("Product quantity is not sufficient");
            }
        } else {
            int totalQuantity = 0;
            for (Shelf i : shelfs) {
                totalQuantity += i.getQuantity();
            }
            if (productRepository.findById(shelf.getProductId()).get().getInventory_quantity() - totalQuantity >= shelf
                    .getQuantity()) {
                if (checkposition != "2" && checkposition != "3") {
                    deleteShelf(checkposition);
                }
                inventory.setQuantity(inventory.getQuantity() + shelf.getQuantity());
                inventoryRepository.save(inventory);
                return shelfRepository.save(shelf);
            } else {
                throw new Exception("Product quantity is not sufficient");
            }
        }
    }

    @Override
    public Shelf updateShelf(String shelfId, Shelf updatedShelf) throws Exception {
        Shelf existingShelf = shelfRepository.findById(shelfId).orElse(null);
        updatedShelf.setId(shelfId);
        if (existingShelf != null) {
            Inventory inventory = inventoryRepository.findById(existingShelf.getInventoryid()).orElse(null);
            String s = CheckPositionExistsShelf(updatedShelf);
            if (!((updatedShelf.getColoum() >= 0 && updatedShelf.getColoum() < inventory.getNumber_coloum())
                    && (updatedShelf.getRow() >= 0 && updatedShelf.getRow() < inventory.getNumber_row()))) {
                throw new Exception("Vị trí này không tồn tại trong kho");
            } else if (s == "1") {
                throw new Exception("Vị trí này thêm không được vì kệ đã có sản phẩm");
            }

            if (inventory.getStatus() == INVENTORY_STATE.CLOSE) {
                throw new Exception("INVENTORY CLOSE");
            }
            List<Shelf> shelfs = shelfRepository.findByproductId(existingShelf.getProductId());
            int totalQuantity = 0;
            for (Shelf i : shelfs) {
                if (!Objects.equals(i.getShelfCode(), existingShelf.getShelfCode()))
                    totalQuantity += i.getQuantity();
            }

            if (updatedShelf.getQuantity() <= existingShelf.getCapacity()
                    && productRepository.findById(existingShelf.getProductId()).get().getInventory_quantity()
                            - totalQuantity >= updatedShelf.getQuantity()) {
                updatequantityShelf(shelfId, updatedShelf.getQuantity());
                existingShelf.setQuantity(updatedShelf.getQuantity());
                existingShelf.setShelfCode(updatedShelf.getShelfCode());
                existingShelf.setRow(updatedShelf.getRow());
                existingShelf.setColoum(updatedShelf.getColoum());
                inventoryRepository.save(inventory);
                return shelfRepository.save(existingShelf);
            } else {
                throw new Exception("Product quantity is not sufficient");
            }
        } else {
            throw new Exception("Shelf with ID " + shelfId + " not found");
        }
    }

    @Override
    public void deleteShelf(String shelfId) {
        Inventory inventory = inventoryRepository.findById(shelfRepository.findById(shelfId).get().getInventoryid())
                .orElse(null);
        if (inventory != null) {
            inventory.setQuantity(inventory.getQuantity() - shelfRepository.findById(shelfId).get().getQuantity());
            inventoryRepository.save(inventory);
        }
        shelfRepository.deleteById(shelfId);
    }

    @Override
    public Optional<Shelf> getShelfById(String shelfId) {
        return shelfRepository.findById(shelfId);
    }

    @Override
    public boolean shelfExists(String shelfId) {
        return shelfRepository.existsById(shelfId);
    }

    @Override
    public List<String> getShelfContainProduct(String productName) {
        Product product = productRepository.findByproductName(productName);
        System.out.println(product.getId());
        List<Shelf> shelves = shelfRepository.findByproductId(product.getId());
        List<String> shelfCode = new ArrayList<>();
        for (Shelf shelf : shelves) {
            shelfCode.add(shelf.getShelfCode());
        }
        System.out.println(shelfCode);
        return shelfCode;
    }

    @Override
    public List<Shelf> searchShelfByCode(String keyword) {
        return shelfRepository.searchByshelfCode(keyword);
    }

    @Override
    public void updatequantityShelf(String shelfId, int quantity) throws Exception {
        Shelf shelf = shelfRepository.findById(shelfId).orElse(null);
        if (shelf != null) {
            Inventory inventory = inventoryRepository.findById(shelf.getInventoryid()).orElse(null);
            if (inventory.getStatus() == INVENTORY_STATE.CLOSE) {
                throw new Exception("INVENTORY CLOSE");
            }
            int totalQuantitybefore = shelf.getQuantity();
            if (inventory != null) {
                int sub_quantity = quantity - totalQuantitybefore;
                int quantity_inventory = inventory.getQuantity() + sub_quantity;
                inventory.setQuantity(quantity_inventory);
                inventoryRepository.save(inventory);
            }
        }
    }

    @Override
    public ShelfEmpty getPositionShelfEmpty(String Inventoryid) {
        Inventory inventory = inventoryRepository.findById(Inventoryid).orElse(null);
        if (inventory != null) {
            List<Shelf> shelfs = shelfRepository.findByinventoryid(Inventoryid);
            ShelfEmpty shelfEmpty = new ShelfEmpty();
            shelfEmpty.setInventoryId(Inventoryid);
            List<ShelfPosition> shelfallPositions = new ArrayList<>();
            List<ShelfPosition> shelfexistsPositions = new ArrayList<>();
            for (int i = 0; i < inventory.getNumber_row(); i++) {
                for (int j = 0; j < inventory.getNumber_coloum(); j++) {
                    ShelfPosition shelf = new ShelfPosition();
                    shelf.setColoum(j);
                    shelf.setRow(i);
                    shelfallPositions.add(shelf);
                }
            }
            for (Shelf i : shelfs) {
                ShelfPosition shelf = new ShelfPosition();
                shelf.setColoum(i.getColoum());
                shelf.setRow(i.getRow());
                shelfexistsPositions.add(shelf);
            }
            shelfallPositions.removeAll(shelfexistsPositions);
            shelfEmpty.setPosition(shelfallPositions);
            return shelfEmpty;
        }
        return null;
    }

    public String CheckPositionExistsShelf(Shelf shelf) {
        Inventory inventory = inventoryRepository.findById(shelf.getInventoryid()).orElse(null);
        List<Shelf> shelfs = shelfRepository.findByinventoryid(inventory.getId());

        if (inventory != null) {
            int x = shelf.getRow();
            int y = shelf.getColoum();
            int count = 0;
            for (Shelf i : shelfs) {
                if (x == i.getRow() && y == i.getColoum()) {
                    if (shelf.getId() == i.getId()) {
                        return "3"; // vị trí của chính nó
                    }
                    if (i.getQuantity() == 0) {
                        return i.getId(); // được phép thêm
                    }
                } else {
                    count++;
                }
            }
            if (count == shelfs.size() && count < inventory.getNumber_shelf()) {
                return "2"; // thêm vì còn chỗ
            }
        }
        return "1";
    }

    public boolean CheckNameExistsShelf(Shelf shelf) {
        List<Shelf> shelfs = shelfRepository.findByinventoryid(shelf.getInventoryid());
        for (Shelf i : shelfs) {
            if (i.getShelfCode().equals(shelf.getShelfCode())) {
                return true;
            }
        }
        return false;
    }
}