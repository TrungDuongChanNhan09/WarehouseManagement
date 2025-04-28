package com.example.backend.state;

import com.example.backend.ENUM.ORDER_ITEM_STATE;
import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.ENUM.ORDER_STATUS;
import com.example.backend.model.Order;
import com.example.backend.model.OrderItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.request.OrderItemRequest;

import java.time.LocalDate;

public class ConfirmedState implements OrderState {

  @Override
  public void confirmOrder(Order order) throws Exception {
    // Không làm gì cả hoặc báo lỗi, vì đã confirmed rồi
    System.out.println("Order " + order.getOrderCode() + " is already confirmed.");
    // throw new Exception("Order is already confirmed.");
  }

  @Override
  public void shipOrder(Order order) throws Exception {
    // Logic chuyển sang ON_GOING
    order.setCurrentState(OrderStateFactory.getState(ORDER_STATE.ON_GOING));
    order.setUpdate_at(LocalDate.now());
    System.out.println("Order " + order.getOrderCode() + " shipped.");
  }

  @Override
  public void deliverOrder(Order order) throws Exception {
    throwInvalidOperation(); // Không thể deliver từ CONFIRMED
  }

  @Override
  public void cancelOrder(Order order, OrderItemRepository orderItemRepository) throws Exception {
    // Logic chuyển sang CANCELLED từ CONFIRMED
    for (String orderItemCode : order.getOrderItem_code()) {
      OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
      if (orderItem != null) {
        orderItem.setOrderItemState(ORDER_ITEM_STATE.OUT_ORDER);
        orderItemRepository.save(orderItem);
      }
    }
    order.setOrderStatus(ORDER_STATUS.OUT_EXPORT);
    order.setCurrentState(OrderStateFactory.getState(ORDER_STATE.CANCELLED));
    order.setUpdate_at(LocalDate.now());
    System.out.println("Order " + order.getOrderCode() + " cancelled.");
  }

  @Override
  public void updateOrderDetails(Order order, OrderItemRequest request, OrderItemRepository orderItemRepository)
      throws Exception {
    throw new Exception("Cannot update order details once confirmed.");
  }

  @Override
  public ORDER_STATE getStateEnum() {
    return ORDER_STATE.CONFIRMED;
  }
}