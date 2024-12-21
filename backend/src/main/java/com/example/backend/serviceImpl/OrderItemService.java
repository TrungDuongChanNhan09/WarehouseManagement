package com.example.backend.serviceImpl;

import com.example.backend.model.ORDER_ITEM_STATE;
import com.example.backend.model.OrderItem;
import com.example.backend.model.Product;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService implements com.example.backend.service.OrderItemService {
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductService productService;

    @Override
    public OrderItem createOrderItem(OrderItem orderItem) throws Exception {
        OrderItem existOrderItemCode = orderItemRepository.findByorderItemCode(orderItem.getOrderItemCode());
        if(existOrderItemCode != null){
            throw new Exception("OrderItem code is already exist");
        }

        Optional<Product> existProduct = productService.getProductById(orderItem.getProduct_id());
        if(existProduct.isEmpty()){
            throw new Exception("Product not found");
        }

        if(existProduct.get().getInventory_quantity() < orderItem.getQuantity()){
            throw new Exception("Product quantity in inventory is not enough");
        }

        OrderItem newOrderItem = new OrderItem();
        newOrderItem.setQuantity(orderItem.getQuantity());
        newOrderItem.setProduct_id(orderItem.getProduct_id());
        newOrderItem.setOrderItemCode(orderItem.getOrderItemCode());
        int totalPrice = orderItem.getQuantity()*existProduct.get().getPrice();

        //check if product quantity in inventory equal with orderItem
        if(existProduct.get().getInventory_quantity() == orderItem.getQuantity()){
            productService.deleteProductById(orderItem.getProduct_id());
        } else {
            existProduct.get().setInventory_quantity(existProduct.get().getInventory_quantity() - orderItem.getQuantity());
            productService.updateProduct(existProduct.get().getId(), existProduct.get());
        }
        newOrderItem.setTotalPrice(totalPrice);
        return orderItemRepository.save(newOrderItem);
    }

    @Override
    public OrderItem updateOrderItem(OrderItem orderItem, String id) throws Exception {
        OrderItem existOrderItem = orderItemRepository.findById(id).orElse(null);
        if(existOrderItem == null){
            throw new Exception("OrderItem not found");
        }

        Optional<Product> existProduct = productService.getProductById(orderItem.getProduct_id());
        if(existProduct.isEmpty()){
            throw new Exception("Product not found");
        }

        if(existProduct.get().getInventory_quantity() < orderItem.getQuantity()){
            throw new Exception("Product quantity in inventory is not enough");
        }

        existOrderItem.setQuantity(orderItem.getQuantity());
        int totalPrice = orderItem.getQuantity()*existProduct.get().getPrice();

        //check if product quantity in inventory equal with orderItem
        if(existProduct.get().getInventory_quantity() == orderItem.getQuantity()){
            productService.deleteProductById(orderItem.getProduct_id());
        } else {
            existProduct.get().setInventory_quantity(existProduct.get().getInventory_quantity() - orderItem.getQuantity());
            productService.updateProduct(existProduct.get().getId(), existProduct.get());
        }
        existOrderItem.setTotalPrice(totalPrice);
        return orderItemRepository.save(existOrderItem);
    }

    @Override
    public void deleteOrderItem(String id) {
        orderItemRepository.deleteById(id);
    }

    @Override
    public Optional<OrderItem> getOrderItemById(String id) {
        return orderItemRepository.findById(id);
    }

    @Override
    public List<OrderItem> getAllOrderItem() {
        return orderItemRepository.findAll();
    }

    @Override
    public List<String> getAllOrderItemCode() {
        List<String> orderItemCode = new ArrayList<>();
        for(OrderItem orderItem : orderItemRepository.findAll()){
            if(orderItem.getOrderItemState() == ORDER_ITEM_STATE.OUT_ORDER) {
                orderItemCode.add(orderItem.getOrderItemCode());
            }
        }
        return orderItemCode;
    }
}
