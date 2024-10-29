package com.dangphuoctai.backend_yourFashion.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.dangphuoctai.backend_yourFashion.entity.Address;
import com.dangphuoctai.backend_yourFashion.entity.Cart;
import com.dangphuoctai.backend_yourFashion.entity.CartItem;
import com.dangphuoctai.backend_yourFashion.entity.Order;
import com.dangphuoctai.backend_yourFashion.entity.OrderItem;
import com.dangphuoctai.backend_yourFashion.entity.Payment;
import com.dangphuoctai.backend_yourFashion.entity.Product;
import com.dangphuoctai.backend_yourFashion.entity.Store;
import com.dangphuoctai.backend_yourFashion.exceptions.APIException;
import com.dangphuoctai.backend_yourFashion.exceptions.ResourceNotFoundException;
import com.dangphuoctai.backend_yourFashion.payloads.OrderDTO;
import com.dangphuoctai.backend_yourFashion.payloads.OrderItemDTO;
import com.dangphuoctai.backend_yourFashion.payloads.OrderResponse;
import com.dangphuoctai.backend_yourFashion.repository.AddressRepo;
import com.dangphuoctai.backend_yourFashion.repository.CartItemRepo;
import com.dangphuoctai.backend_yourFashion.repository.CartRepo;
import com.dangphuoctai.backend_yourFashion.repository.OrderItemRepo;
import com.dangphuoctai.backend_yourFashion.repository.OrderRepo;
import com.dangphuoctai.backend_yourFashion.repository.PaymentRepo;
import com.dangphuoctai.backend_yourFashion.repository.StoreRepo;
import com.dangphuoctai.backend_yourFashion.repository.UserRepo;
import com.dangphuoctai.backend_yourFashion.service.CartService;
import com.dangphuoctai.backend_yourFashion.service.OrderService;
import com.dangphuoctai.backend_yourFashion.service.UserService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    public UserRepo userRepo;

    @Autowired
    public CartRepo cartRepo;

    @Autowired
    public OrderRepo orderRepo;

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    public OrderItemRepo orderItemRepo;

    @Autowired
    public CartItemRepo cartItemRepo;

    @Autowired
    public UserService userService;

    @Autowired
    public CartService cartService;

    @Autowired
    public StoreRepo storeRepo;

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    public ModelMapper modelMapper;

    @Override
    public String placeOrder(String emailId, Long cartId, String paymentMethod, OrderDTO orderDTOin,
            List<Long> productIds) {
        Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);

        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }
        if (productIds.isEmpty()) {
            throw new ResourceNotFoundException("List productId", "productIds", productIds);
        }
        List<CartItem> cartItems = new ArrayList<>();
        List<Long> stores = new ArrayList<>();
        for (CartItem cartItem : cart.getCartItems()) {
            if (productIds.contains(cartItem.getProduct().getProductId())) {
                cartItems.add(cartItem);
                Long storeId = cartItem.getProduct().getStore().getStoreId();
                if (!stores.contains(storeId)) {
                    stores.add(storeId);
                }
            }
        }
        if (cartItems.size() == 0) {
            throw new APIException("Cart is empty");
        }
        if (stores.size() == 0) {
            throw new APIException("Store is empty");
        }
        System.out.println("orders" + orderDTOin);

        String country = orderDTOin.getAddress().getCountry();
        String district = orderDTOin.getAddress().getDistrict();
        String city = orderDTOin.getAddress().getCity();
        String pincode = orderDTOin.getAddress().getPincode();
        String ward = orderDTOin.getAddress().getWard();
        String buildingName = orderDTOin.getAddress().getBuildingName();
        Address address = addressRepo.findByCountryAndDistrictAndCityAndPincodeAndWardAndBuildingName(
                country, district,
                city, pincode, ward, buildingName);
        if (address == null) {
            address = new Address(country, district, city, pincode, ward, buildingName);
            address = addressRepo.save(address);
        }
        /////
        for (Long storeId : stores) {
            // create order
            Order order = new Order();
            Store storeOrder = storeRepo.getReferenceById(storeId);
            order.setStore(storeOrder);
            order.setAddress(address);
            order.setEmail(emailId);
            order.setDeliveryName(orderDTOin.getDeliveryName());
            order.setDeliveryPhone(orderDTOin.getDeliveryPhone());
            order.setOrderDate(LocalDate.now());
            order.setTotalAmount(0.0);
            order.setOrderStatus("Order Accepted !");
            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setPaymentMethod(paymentMethod);
            if (orderDTOin.getPayment() != null) {
                payment.setPaymentCode(orderDTOin.getPayment().getPaymentCode());
            }
            payment = paymentRepo.save(payment);
            order.setPayment(payment);
            Order savedOrder = orderRepo.save(order);
            double total = 0;
            // create orderItem by order
            List<OrderItem> orderItems = new ArrayList<>();
            for (CartItem cartItem : cartItems) {
                if (storeId == cartItem.getProduct().getStore().getStoreId()) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setDiscount(cartItem.getProduct().getDiscount());
                    orderItem.setOrderedProductPrice(cartItem.getProduct().getSpecialPrice());
                    orderItem.setOrder(savedOrder);
                    orderItems.add(orderItem);
                    total += cartItem.getQuantity() * cartItem.getProduct().getSpecialPrice();
                }
            }
            savedOrder.setTotalAmount(total);
            orderItems = orderItemRepo.saveAll(orderItems);
        }
        // update cart
        cartItems.forEach(item -> {
            int quantity = item.getQuantity();

            Product product = item.getProduct();

            cartService.deleteProductFromCart(cartId, product.getProductId());

            product.setQuantity(product.getQuantity() - quantity);

        });

        return "Place Order productIds " + productIds + " success the cartId " + cartId;

    }

    @Override
    public OrderDTO placeOrder(String emailId, Long cartId, String paymentMethod, OrderDTO orderDTOin) {

        Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);

        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }
        System.out.println("orders" + orderDTOin);
        Order order = new Order();

        String country = orderDTOin.getAddress().getCountry();
        String district = orderDTOin.getAddress().getDistrict();
        String city = orderDTOin.getAddress().getCity();
        String pincode = orderDTOin.getAddress().getPincode();
        String ward = orderDTOin.getAddress().getWard();
        String buildingName = orderDTOin.getAddress().getBuildingName();
        Address address = addressRepo.findByCountryAndDistrictAndCityAndPincodeAndWardAndBuildingName(
                country, district,
                city, pincode, ward, buildingName);
        if (address == null) {
            address = new Address(country, district, city, pincode, ward, buildingName);
            address = addressRepo.save(address);
        }

        order.setAddress(address);

        order.setEmail(emailId);
        order.setDeliveryName(orderDTOin.getDeliveryName());
        order.setDeliveryPhone(orderDTOin.getDeliveryPhone());
        order.setOrderDate(LocalDate.now());

        order.setTotalAmount(cart.getTotalPrice());
        order.setOrderStatus("Order Accepted !");

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(paymentMethod);
        if (orderDTOin.getPayment() != null) {
            payment.setPaymentCode(orderDTOin.getPayment().getPaymentCode());
        }
        payment = paymentRepo.save(payment);

        order.setPayment(payment);

        Order savedOrder = orderRepo.save(order);

        List<CartItem> cartItems = cart.getCartItems();

        if (cartItems.size() == 0) {
            throw new APIException("Cart is empty");

        }
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();

            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setDiscount(cartItem.getProduct().getDiscount());
            orderItem.setOrderedProductPrice(cartItem.getProduct().getSpecialPrice());
            orderItem.setOrder(savedOrder);
            orderItems.add(orderItem);
        }

        orderItems = orderItemRepo.saveAll(orderItems);

        cart.getCartItems().forEach(item -> {
            int quantity = item.getQuantity();

            Product product = item.getProduct();

            cartService.deleteProductFromCart(cartId, item.getProduct().getProductId());

            product.setQuantity(product.getQuantity() - quantity);

        });

        OrderDTO orderDTO = modelMapper.map(savedOrder, OrderDTO.class);

        orderItems.forEach(item -> orderDTO.getOrderItems().add(modelMapper.map(item, OrderItemDTO.class)));

        return orderDTO;

    }

    @Override
    public List<OrderDTO> getOrdersByUser(String emailId, Integer pageNumber, Integer pageSize, String sortBy,
            String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Order> pageOrders = orderRepo.findAllByEmail(emailId, pageDetails);

        List<Order> orders = pageOrders.getContent();
        List<OrderDTO> orderDTOs = orders.stream().map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
        // if (orderDTOs.size() == 0) {
        // throw new APIException("No orders placed yet by the user with email: " +
        // emailId);
        // }

        return orderDTOs;

    }

    @Override
    public OrderDTO getOrder(String emailId, Long orderId, String emailCheck) {

        Order order = orderRepo.findOrderByEmailAndOrderId(emailId, orderId);
        if (emailCheck != null && !order.getStore().getEmail().equals(emailCheck)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        if (order == null) {
            throw new ResourceNotFoundException("Order", "orderId", orderId);

        }

        return modelMapper.map(order, OrderDTO.class);

    }

    @Override
    public OrderResponse getAllOrdersByStoreId(Long storeId, String emailCheck, Integer pageNumber, Integer pageSize,
            String sortBy,
            String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Order> pageOrders = orderRepo.findAllByStoreStoreId(storeId, pageDetails);
        List<Order> orders = pageOrders.getContent();
        if (emailCheck != null && !orders.get(0).getStore().getEmail().equals(emailCheck)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        List<OrderDTO> orderDTOs = orders.stream().map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
        if (orderDTOs.size() == 0) {
            throw new APIException("No orders placed yet by the users");
        }

        OrderResponse orderResponse = new OrderResponse();

        orderResponse.setContent(orderDTOs);
        orderResponse.setPageNumber(pageOrders.getNumber());
        orderResponse.setPageSize(pageOrders.getSize());
        orderResponse.setTotalElements(pageOrders.getTotalElements());
        orderResponse.setTotalPages(pageOrders.getTotalPages());
        orderResponse.setLastPage(pageOrders.isLast());

        return orderResponse;
    }

    @Override
    public OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Order> pageOrders = orderRepo.findAll(pageDetails);

        List<Order> orders = pageOrders.getContent();

        List<OrderDTO> orderDTOs = orders.stream().map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
        if (orderDTOs.size() == 0) {
            throw new APIException("No orders placed yet by the users");
        }

        OrderResponse orderResponse = new OrderResponse();

        orderResponse.setContent(orderDTOs);
        orderResponse.setPageNumber(pageOrders.getNumber());
        orderResponse.setPageSize(pageOrders.getSize());
        orderResponse.setTotalElements(pageOrders.getTotalElements());
        orderResponse.setTotalPages(pageOrders.getTotalPages());
        orderResponse.setLastPage(pageOrders.isLast());

        return orderResponse;
    }

    @Override
    public OrderDTO updateOrder(String emailId, Long orderId, String orderStatus, String emailCheck) {

        Order order = orderRepo.findOrderByEmailAndOrderId(emailId, orderId);
        if (emailCheck != null && !order.getStore().getEmail().equals(emailCheck)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        if (order == null) {
            throw new ResourceNotFoundException("Order", "orderId", orderId);
        }

        order.setOrderStatus(orderStatus);

        return modelMapper.map(order, OrderDTO.class);
    }
}
