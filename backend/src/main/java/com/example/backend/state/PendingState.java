package com.example.backend.state;

import com.example.backend.ENUM.ORDER_ITEM_STATE;
import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.ENUM.ORDER_STATUS;
import com.example.backend.model.Order;
import com.example.backend.model.OrderItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.request.OrderItemRequest;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class PendingState implements OrderState {

  @Override
  public void confirmOrder(Order order) throws Exception {
    // Logic chuyển sang trạng thái CONFIRMED
    order.setCurrentState(OrderStateFactory.getState(ORDER_STATE.CONFIRMED));
    order.setUpdate_at(LocalDate.now());
    System.out.println("Order " + order.getOrderCode() + " confirmed.");
  }

  @Override
  public void shipOrder(Order order) throws Exception {
    throwInvalidOperation(); // Không thể ship từ PENDING
  }

  @Override
  public void deliverOrder(Order order) throws Exception {
    throwInvalidOperation(); // Không thể deliver từ PENDING
  }

  @Override
  public void cancelOrder(Order order, OrderItemRepository orderItemRepository) throws Exception {
    // Logic chuyển sang trạng thái CANCELLED
    // Logic cập nhật OrderItem và OrderStatus như trong service cũ
    for (String orderItemCode : order.getOrderItem_code()) {
      OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
      if (orderItem != null) { // Kiểm tra null phòng trường hợp dữ liệu không nhất quán
        orderItem.setOrderItemState(ORDER_ITEM_STATE.OUT_ORDER);
        orderItemRepository.save(orderItem);
      }
    }
    order.setOrderStatus(ORDER_STATUS.OUT_EXPORT); // Set status khi cancel
    order.setCurrentState(OrderStateFactory.getState(ORDER_STATE.CANCELLED));
    order.setUpdate_at(LocalDate.now());
    System.out.println("Order " + order.getOrderCode() + " cancelled.");
  }

  @Override
  public void updateOrderDetails(Order order, OrderItemRequest request, OrderItemRepository orderItemRepository)
      throws Exception {
    // Logic cập nhật chi tiết đơn hàng (như trong service cũ)
    // Lưu ý: Cần xem xét logic hoàn trả/cập nhật số lượng sản phẩm nếu cần
    order.setUpdate_at(LocalDate.now());
    order.setDelivery_Address(request.getDelivery_Address());

    // Xử lý cập nhật order items (có thể phức tạp hơn, cần logic hoàn trả item cũ,
    // thêm item mới)
    // Ví dụ đơn giản: chỉ cập nhật danh sách mã và số lượng
    // *** CẢNH BÁO: Logic cập nhật order items cần chi tiết hơn nhiều trong thực tế
    // ***
    // Ví dụ: cần đánh dấu item cũ là OUT_ORDER, item mới là IN_ORDER, tính lại
    // giá,...
    List<String> oldItemCodes = new ArrayList<>(order.getOrderItem_code()); // Sao lưu để xử lý item cũ nếu cần

    order.setOrderItem_code(request.getOrderItem_code());
    order.setOrderItem_quantity(request.getOrderItem_code().size());

    int totalPrice = 0;
    for (String orderItemCode : request.getOrderItem_code()) {
      OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
      if (orderItem == null) {
        throw new Exception("Order item with code " + orderItemCode + " not found.");
      }
      totalPrice += orderItem.getTotalPrice();
      // Đảm bảo trạng thái của item được cập nhật đúng
      if (orderItem.getOrderItemState() == ORDER_ITEM_STATE.OUT_ORDER) {
        orderItem.setOrderItemState(ORDER_ITEM_STATE.IN_ORDER);
        orderItemRepository.save(orderItem);
      }
    }
    // Cần thêm logic xử lý những item bị loại bỏ khỏi đơn hàng (oldItemCodes không
    // có trong request.getOrderItem_code())
    // ví dụ: chuyển state của chúng về OUT_ORDER

    order.setOrderPrice(totalPrice);
    System.out.println("Order " + order.getOrderCode() + " details updated.");
  }

  @Override
  public ORDER_STATE getStateEnum() {
    return ORDER_STATE.PENDING;
  }
}