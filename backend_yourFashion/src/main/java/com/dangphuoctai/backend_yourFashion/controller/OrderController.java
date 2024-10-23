package com.dangphuoctai.backend_yourFashion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dangphuoctai.backend_yourFashion.config.AppConstants;
import com.dangphuoctai.backend_yourFashion.payloads.OrderDTO;
import com.dangphuoctai.backend_yourFashion.payloads.OrderResponse;
import com.dangphuoctai.backend_yourFashion.service.OrderService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class OrderController {

    @Autowired
    public OrderService orderService;

    @PostMapping("/public/users/{emailId}/carts/{cartId}/payments/{paymentMethod}/order")
    public ResponseEntity<OrderDTO> orderProducts(@PathVariable String emailId, @PathVariable Long cartId,
            @PathVariable String paymentMethod, @RequestBody OrderDTO orderDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));
        // Nếu không phải admin, chỉ cho phép người dùng truy cập thông tin của họ
        if (!isAdmin && !emailId.equals(currentEmail)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        OrderDTO order = orderService.placeOrder(emailId, cartId, paymentMethod, orderDTO);

        return new ResponseEntity<OrderDTO>(order, HttpStatus.CREATED);

    }

    @GetMapping("/admin/orders")
    public ResponseEntity<OrderResponse> getAllOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        OrderResponse orderResponse = orderService.getAllOrders(
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "orderId" : sortBy,
                sortOrder);

        return new ResponseEntity<OrderResponse>(orderResponse, HttpStatus.OK);

    }

    @GetMapping("/seller/stores/{email}/orders")
    public ResponseEntity<OrderResponse> getOrdersByStore(@PathVariable String email,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        OrderResponse orderResponse = orderService.getAllOrdersByStoreEmail(email,
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "orderId" : sortBy,
                sortOrder);

        return new ResponseEntity<OrderResponse>(orderResponse, HttpStatus.OK);

    }

    @GetMapping("public/users/{emailId}/orders")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser(@PathVariable String emailId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));
        // Nếu không phải admin, chỉ cho phép người dùng truy cập thông tin của họ
        if (!isAdmin && !emailId.equals(currentEmail)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        List<OrderDTO> orders = orderService.getOrdersByUser(
                emailId,
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "orderId" : sortBy,
                sortOrder);

        return new ResponseEntity<List<OrderDTO>>(orders, HttpStatus.OK);

    }

    @GetMapping("public/users/{emailId}/orders/{orderId}")
    public ResponseEntity<OrderDTO> getOrderByUser(@PathVariable String emailId, @PathVariable Long orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));
        boolean isSeller = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("SELLER"));
        // Nếu không phải admin, chỉ cho phép người dùng truy cập thông tin của họ
        if (!isAdmin && !emailId.equals(currentEmail) && !isSeller) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        OrderDTO order = orderService.getOrder(emailId, orderId, isSeller ? currentEmail : null);

        return new ResponseEntity<OrderDTO>(order, HttpStatus.OK);

    }

    @PutMapping("seller/users/{emailId}/orders/{orderId}/orderStatus/{orderStatus}")
    public ResponseEntity<OrderDTO> updateOrderByUser(@PathVariable String emailId, @PathVariable Long orderId,
            @PathVariable String orderStatus) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));
        boolean isSeller = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("SELLER"));
        // Nếu không phải admin, chỉ cho phép người dùng truy cập thông tin của họ
        if (!isAdmin && !isSeller) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        OrderDTO order = orderService.updateOrder(emailId, orderId, orderStatus, isSeller ? currentEmail : null);

        return new ResponseEntity<OrderDTO>(order, HttpStatus.OK);
    }
}