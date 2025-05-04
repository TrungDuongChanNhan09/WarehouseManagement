package com.example.backend.state;

import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.model.Order;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.request.OrderItemRequest;

public class CancelledState implements OrderState {

  // Không cho phép bất kỳ hành động nào khi đã hủy
  private void throwCancelledError() throws Exception {
    throw new Exception("Order is already cancelled.");
  }

  @Override
  public void confirmOrder(Order order) throws Exception {
    throwCancelledError();
  }

  @Override
  public void shipOrder(Order order) throws Exception {
    throwCancelledError();
  }

  @Override
  public void deliverOrder(Order order) throws Exception {
    throwCancelledError();
  }

  @Override
  public void cancelOrder(Order order, OrderItemRepository orderItemRepository) throws Exception {
    System.out.println("Order " + order.getOrderCode() + " is already cancelled.");
    // throwCancelledError();
  }

  @Override
  public void updateOrderDetails(Order order, OrderItemRequest request, OrderItemRepository orderItemRepository)
      throws Exception {
    throwCancelledError();
  }

  @Override
  public ORDER_STATE getStateEnum() {
    return ORDER_STATE.CANCELLED;
  }
}