package com.example.backend.state;

import com.example.backend.ENUM.ORDER_STATE;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class OrderStateFactory {
  // Dùng map để cache lại các instance của State (singleton)
  private static final Map<ORDER_STATE, OrderState> stateCache = new ConcurrentHashMap<>();

  static {
    stateCache.put(ORDER_STATE.PENDING, new PendingState());
    stateCache.put(ORDER_STATE.CONFIRMED, new ConfirmedState());
    stateCache.put(ORDER_STATE.ON_GOING, new OnGoingState());
    stateCache.put(ORDER_STATE.DELIVERED, new DeliveredState());
    stateCache.put(ORDER_STATE.CANCELLED, new CancelledState());
  }

  public static OrderState getState(ORDER_STATE stateEnum) {
    OrderState state = stateCache.get(stateEnum);
    if (state == null) {
      // Hoặc có thể throw exception nếu stateEnum không hợp lệ
      throw new IllegalArgumentException("Invalid state enum: " + stateEnum);
    }
    return state;
  }
}