package com.dangphuoctai.backend_yourFashion.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dangphuoctai.backend_yourFashion.entity.Cart;
import com.dangphuoctai.backend_yourFashion.entity.CartItem;
import com.dangphuoctai.backend_yourFashion.entity.Product;
import com.dangphuoctai.backend_yourFashion.exceptions.APIException;
import com.dangphuoctai.backend_yourFashion.exceptions.ResourceNotFoundException;
import com.dangphuoctai.backend_yourFashion.payloads.CartDTO;
import com.dangphuoctai.backend_yourFashion.payloads.CartItemDTO;
import com.dangphuoctai.backend_yourFashion.repository.CartItemRepo;
import com.dangphuoctai.backend_yourFashion.repository.CartRepo;
import com.dangphuoctai.backend_yourFashion.repository.ProductRepo;
import com.dangphuoctai.backend_yourFashion.service.CartService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private ModelMapper modelMapper;

    private double total = 0;
    private final Map<Long, Lock> lockMap = new ConcurrentHashMap<>();

    private Lock getLock(Long cartId) {
        return lockMap.computeIfAbsent(cartId, id -> new ReentrantLock());
    }

    @Override
    public CartDTO addProductToCart(Long cartId, Long productId, Integer quantity) {
        Lock cartLock = getLock(cartId);
        boolean isLocked = false;
        try {
            isLocked = cartLock.tryLock(10, TimeUnit.SECONDS); // Cố gắng lấy khóa trong 10 giây
            if (!isLocked) {
                throw new APIException("Giỏ hàng hiện đang được chỉnh sửa. Vui lòng thử lại sau.");
            }

            Cart cart = cartRepo.findById(cartId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

            Product product = productRepo.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

            CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);

            if (cartItem != null) {
                throw new APIException("Product " + product.getProductName() + " already exists in the cart");
            }
            if (product.getQuantity() == 0) {
                throw new APIException(product.getProductName() + " is not available");
            }
            if (product.getQuantity() < quantity) {
                throw new APIException("Please, make an order of the " + product.getProductName()
                        + " less than or equal to the quantity " + product.getQuantity() + ".");
            }

            CartItem newCartItem = new CartItem();

            newCartItem.setProduct(product);
            newCartItem.setCart(cart);
            newCartItem.setQuantity(quantity);

            cartItemRepo.save(newCartItem);

            // product.setQuantity(product.getQuantity() - quantity);

            cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));

            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

            List<CartItemDTO> cartItems = cart.getCartItems().stream().map(p -> {
                CartItemDTO cartItemDTO = modelMapper.map(p, CartItemDTO.class);

                return cartItemDTO;
            }).collect(Collectors.toList());
            cartDTO.setCartItems(cartItems);
            return cartDTO;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new APIException("Quá trình bị gián đoạn.");
        } finally {
            cartLock.unlock(); // Mở khóa sau khi xử lý xong
        }
    }

    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepo.findAll();

        // if (carts.size() == 0) {
        // throw new APIException("No cart exists");
        // }
        List<CartDTO> cartDTOs = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

            List<CartItemDTO> cartItems = cart.getCartItems().stream().map(p -> {
                CartItemDTO cartItemDTO = modelMapper.map(p, CartItemDTO.class);

                return cartItemDTO;
            }).collect(Collectors.toList());
            cartDTO.setCartItems(cartItems);
            cartDTO.setEmail(cart.getUser().getEmail());

            return cartDTO;

        }).collect(Collectors.toList());

        return cartDTOs;

    }

    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);

        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

        List<CartItemDTO> cartItems = cart.getCartItems().stream().map(p -> {
            CartItemDTO cartItemDTO = modelMapper.map(p, CartItemDTO.class);

            return cartItemDTO;
        }).collect(Collectors.toList());
        Collections.sort(cartItems, (cartItem1, cartItem2) -> {
            return (int) (cartItem2.getCartItemId() - cartItem1.getCartItemId());
        });
        cartDTO.setCartItems(cartItems);
        cartDTO.setEmail(cart.getUser().getEmail());

        return cartDTO;

    }

    @Override
    public void updateProductInCarts(Long cartId, Long productId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);

        if (cartItem == null) {
            throw new APIException("Product " + product.getProductName() + " not available in the cart !!! ");
        }
        double cartPrice = cart.getTotalPrice() - (cartItem.getProduct().getSpecialPrice() * cartItem.getQuantity());

        cart.setTotalPrice(cartPrice + (cartItem.getProduct().getSpecialPrice() * cartItem.getQuantity()));

        cartItem = cartItemRepo.save(cartItem);
    }

    @Override
    public CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        if (product.getQuantity() == 0) {
            throw new APIException(product.getProductName() + " is not available");

        }

        if (product.getQuantity() < quantity) {
            throw new APIException("Please, make an order of the " + product.getProductName()
                    + " less than or equal to the quantity " + product.getQuantity() + ".");

        }
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);

        if (cartItem == null) {
            throw new APIException("Product " + product.getProductName() + " not available in the cart !!! ");

        }

        double cartPrice = cart.getTotalPrice() - (cartItem.getProduct().getSpecialPrice() * cartItem.getQuantity());

        // product.setQuantity(product.getQuantity() + cartItem.getQuantity() -
        // quantity);

        cartItem.setQuantity(quantity);

        cart.setTotalPrice(cartPrice + (cartItem.getProduct().getSpecialPrice() * quantity));

        cartItem = cartItemRepo.save(cartItem);

        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

        List<CartItemDTO> cartItems = cart.getCartItems().stream().map(p -> {
            CartItemDTO cartItemDTO = modelMapper.map(p, CartItemDTO.class);

            return cartItemDTO;
        }).collect(Collectors.toList());
        cartDTO.setCartItems(cartItems);
        return cartDTO;

    }

    @Override
    public String deleteProductFromCart(Long cartId, Long productId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);

        if (cartItem == null) {
            throw new ResourceNotFoundException("Product", "productId", productId + "aaaa" + cartId);
        }

        cart.setTotalPrice(cart.getTotalPrice() - (cartItem.getProduct().getSpecialPrice() * cartItem.getQuantity()));

        cartItemRepo.deleteCartItemByProductIdAndCartId(productId, cartId);

        return "Product " + cartItem.getProduct().getProductName() + " removed from the cart !!! ";

    }

    @Override
    public String deleteProductFromCartAll(Long cartId, List<Long> productIds) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        List<CartItem> cartItems = cartItemRepo.findCartItemByProductIdsAndCartId(cartId, productIds);

        if (cartItems.isEmpty()) {
            throw new ResourceNotFoundException("Product", "productId", productIds);
        }
        total = cart.getTotalPrice();
        for (CartItem item : cartItems) {
            total -= item.getProduct().getSpecialPrice() * item.getQuantity();
        }
        cartItemRepo.deleteCartItemByProductIdsAndCartId(productIds, cartId);
        cart.setTotalPrice(total);

        return "Product removed from the cart !!! ";

    }
}