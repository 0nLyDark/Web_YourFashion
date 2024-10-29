import React, { createContext, useContext, useState, useEffect } from "react";
import { apiURL } from "../api/apiConfig";
import { GET_ALL, GET_ID, POST_ADD, PUT_EDIT } from "../api/apiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Tạo CartContext
const CartContext = createContext();

// Provider để bao quanh các component cần dùng giỏ hàng
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);
  const cartId = localStorage.getItem("cartId");
  const email = localStorage.getItem("email");
  useEffect(() => {
    if (cartId && email) {
      GET_ID(`users/${email}/carts`, cartId)
        .then((response) => {
          if (response) {
            setCartItems(response.cartItems);
            console.log("cart", response.cartItems);
          }
        })
        .catch((error) => console.error(error));
    }
  }, []);
  useEffect(() => {
    setCartLength(cartItems.length);
  }, [cartItems]);
  // Hàm thêm sản phẩm vào giỏ hàng

  const addToCart = async (productId, quantity) => {
    let bool = false;
    let sl = 0;
    for (const cartItem of cartItems) {
      if (cartItem.product.productId === productId) {
        bool = true;
        sl = cartItem.quantity + quantity;
        break; // nếu bạn chỉ cần kiểm tra một phần tử thì có thể thoát khỏi vòng lặp sớm
      }
    }
    if (!bool) {
      await POST_ADD(
        `carts/${cartId}/products/${productId}/quantity/${quantity}`,
        {}
      )
        .then((response) => {
          if (response) {
            setCartItems(response.cartItems);
            console.log("responseCart", response);
            console.log("add product in cart success");
            toast("Thêm vào giỏ hàng thành công", {
              position: "top-center",
              autoClose: 2000,
            });
          }
        })
        .catch((error) => {
          toast.error("Thêm vào giỏ hàng thất bại", {
            position: "top-center",
            autoClose: 2000,
          });
          console.error("Add cart faield" + error);
        });
    } else {
      await PUT_EDIT(`carts/${cartId}/products/${productId}/quantity/${sl}`, {})
        .then((response) => {
          if (response) {
            console.log("responseCart", response);
            setCartItems(response.cartItems);
            console.log("updated product in cart success");
            toast("Cập nhật số lượng sản phẩm trong giỏ hàng thành công", {
              position: "top-center",
              autoClose: 2000,
            });
          }
        })
        .catch((error) => {
          toast.error("Cập nhật số lượng sản phẩm trong giỏ hàng thất bại", {
            position: "top-center",
            autoClose: 2000,
          });
          console.error("Updated cart faield" + error);
        });
    }
  };
  const deleteCart = (productId) => {
    setCartItems(
      cartItems.filter((cartItem) => cartItem.product.productId != productId)
    );
    toast("Xóa sản phẩm ra khỏi giỏ hàng thành công", {
      position: "top-center",
      autoClose: 2000,
    });
  };
  const deleteCartAll = (productIds) => {
    let newCartItems = cartItems.filter(
      (cartItem) => !productIds.includes(cartItem.product.productId)
    );
    setCartItems(newCartItems);
    toast("Xóa sản phẩm ra khỏi giỏ hàng thành công", {
      position: "top-center",
      autoClose: 2000,
    });
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLength,
        setCartItems,
        addToCart,
        deleteCart,
        deleteCartAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook để dùng giỏ hàng trong các component
export const useCart = () => useContext(CartContext);
