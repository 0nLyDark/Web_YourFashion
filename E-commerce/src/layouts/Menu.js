import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GET_ALL } from "../api/apiService";
import MenuItem from "../page/Menu/menuItem";
function Menu() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 10,
      sortBy: "categoryId",
      sortOrder: "asc",
      type: "parent",
    };

    GET_ALL("categories", params) // Pass the query parameters here
      .then((response) => {
        // Assuming the response structure has the data inside 'data'
        setCategories(response.content); // Update the state with the fetched data
        console.log("response", response.content);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error); // Handle any errors
      });
  }, []);
  return (
    <ul class="navbar-nav">
      <li class=" menu-item">
        <Link class="menu-link" to="/">
          <strong style={{ fontSize: "14px" }}>Trang chủ</strong>
        </Link>
      </li>
      <li class=" menu-item dropdown">
        <Link class="menu-link " to="/ListingGrid">
          <strong style={{ fontSize: "14px" }}>Sản phẩm</strong>
        </Link>
        <i class="fa-light fa-chevron-down"></i>
        <ul class="dropdown-menu">
          {categories.length > 0 &&
            categories.map((row) => <MenuItem category={row} />)}
        </ul>
      </li>
      <li class=" menu-item">
        <Link class="menu-link" to="/">
          <strong style={{ fontSize: "14px" }}>Giói Thiệu</strong>
        </Link>
      </li>
      <li class=" menu-item">
        <Link class="menu-link" to="/">
          <strong style={{ fontSize: "14px" }}>Bài viết</strong>
        </Link>
      </li>
      <li class=" menu-item">
        <Link class="menu-link" to="/">
          <strong style={{ fontSize: "14px" }}>Liên hệ</strong>
        </Link>
      </li>
    </ul>
  );
}

export default Menu;
