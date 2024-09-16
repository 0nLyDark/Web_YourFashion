import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import UserLogin from "./UserLogin";
import UserLogout from "./UserLogout";
import Listinggrid from "./Listinggrid";
import ProductDetail from "../page/Product/productDetail";
import { NotFound } from "./NotFound";
import Cart from "./Cart";
import UserRegister from "./UserRegister";
import CheckOut from "./CheckOut";
const Main = () => (
  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<UserLogin />} />
      <Route path="/Logout" element={<UserLogout />} />
      <Route path="/Register" element={<UserRegister />} />

      <Route path="/ListingGrid" element={<Listinggrid />} />
      <Route path="/ProductDetail/:id" element={<ProductDetail />} />
      <Route path="/Cart" element={<Cart />} />
      <Route path="/CheckOut" element={<CheckOut />} />

      <Route path="/*" element={<NotFound />} />
    </Routes>
  </main>
);

export default Main;
