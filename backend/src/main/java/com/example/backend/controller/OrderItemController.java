package com.example.backend.controller;

import com.example.backend.model.OrderItem;
import com.example.backend.model.User;
import com.example.backend.request.OrderItemRequest;
import com.example.backend.service.OrderItemService;
import com.example.backend.serviceImpl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orderItem")
public class OrderItemController {
    @Autowired
    private UserService userService;

    @Autowired
    private OrderItemService orderItemService;

    @PostMapping("")
    public ResponseEntity<OrderItem> createOrderItem(@RequestHeader("Authorization") String jwt, @RequestBody OrderItem orderItem) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderItemService.createOrderItem(orderItem), HttpStatus.CREATED);
    }

    @PutMapping("/updateOrderItem/{id}")
    public ResponseEntity<OrderItem> updateOrderItem(@RequestHeader("Authorization") String jwt, @RequestBody OrderItem orderItem, @PathVariable String id) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderItemService.updateOrderItem(orderItem, id), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<OrderItem>> getOrderItem(@RequestHeader("Authorization") String jwt, @PathVariable String id) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderItemService.getOrderItemById(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@RequestHeader("Authorization") String jwt, @PathVariable String id) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        orderItemService.deleteOrderItem(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<List<OrderItem>> getAllOrderItem(@RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderItemService.getAllOrderItem(), HttpStatus.OK);
    }

    @GetMapping("/getOrderItemCode")
    public ResponseEntity<List<String>> getOrderItemCode(@RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderItemService.getAllOrderItemCode(), HttpStatus.OK);
    }
}
