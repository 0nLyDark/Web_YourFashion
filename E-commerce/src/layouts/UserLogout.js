import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead
import {useCart} from "../context/CartContext"
function UserLogout() {
  const {setCartItems} = useCart();
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    localStorage.removeItem("cartId");
    setCartItems([]);
    navigate("/");
  }, []);
}

export default UserLogout;
