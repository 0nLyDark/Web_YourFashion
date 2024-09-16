import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatCurrency } from "./formatCurrency";
import { GET_ALL, GET_ID, POST_ADD, PUT_EDIT } from "../../api/apiService";
import { apiURL } from "../../api/apiConfig";
import ProductItem from "./productItem";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const params = {
    pageNumber: "1",
    pageSize: "4",
    sortBy: "createdAt",
    sortOrder: "desc",
    sale: false,
  };
  useEffect(() => {
    GET_ID("products", id)
      .then((item) => {
        setProduct(item);
        GET_ALL(`categories/${item.category.categoryId}/products`, params)
          .then((response) => {
            setProducts(response.content);
            console.log("data", response);
          })
          .catch((error) => {
            console.error("Failed to fetch products:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch product:", error);
      });
  }, [id]);
  useEffect(() => {
    console.log(product);
    setQuantity(1);
  }, [product]);
  const changeQuantity = (event) => {
    const value = parseInt(event.target.value, 10);

    // Kiểm tra giá trị nhập vào có hợp lệ hay không
    if (!isNaN(value) && value > 0) {
      if (product && value > product.quantity) {
        setQuantity(product.quantity);
      } else {
        setQuantity(value);
      }
    } else if (event.target.value === "") {
      // Cho phép giá trị trống tạm thời trong khi người dùng nhập
      setQuantity(1);
    }
  };
  const plusQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };
  const minusQuantity = async () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const addCart = () => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      addToCart(product.productId, quantity);
    }else{
      toast("Hãy đăng nhập để liên kết với giỏ hảng của bạn",{
        position:"top-center",
        autoClose:2000,
      })
    }
  };
  return (
    <section className="content">
      <div className="container p-4">
        <div className="row product-detail">
          <div className="col-md-6 col-12 ">
            <img
              src={`${apiURL}products/image/${product ? product.image : ""}`}
              className="img-fluid"
              style={{ minHeight: "500px" }}
            />
          </div>
          <div className="col-md-6 col-12 ps-4 mt-4">
            <h1 className="product-detail-name pb-2">
              {product ? product.productName : ""}
            </h1>
            <h2 class="product-detail-brand fs-5">
              Số lượng còn lại: {product ? product.quantity : "???"}
            </h2>
            {product &&
              (product.discount == 0 ? (
                <strong>
                  <span className="product-detail-price">
                    {formatCurrency(product.price)}
                    {/* <sup>đ</sup> */}
                  </span>
                </strong>
              ) : (
                <strong>
                  <span className="product-detail-price">
                    {formatCurrency(product.specialPrice)}
                    {/* <sup>đ</sup> */}
                  </span>
                  <span className="ms-2" style={{ color: "grey" }}>
                    <del>{formatCurrency(product.price)}</del>
                    {/* <sup>đ</sup> */}
                  </span>
                </strong>
              ))}
            <p>
              Compact sport shoe for running, consectetur adipisicing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat
            </p>
            <p className="mt-3">
              Chọn kích thước:
              <strong id="size_value" style={{ textTransform: "uppercase" }}>
                {" "}
                s
              </strong>
            </p>
            <div className="size__btn mb-3">
              <label for="s-btn" className="active ">
                <input
                  type="radio"
                  name="size_product"
                  id="s-btn"
                  value="s"
                  checked
                />
                s
              </label>
              <label for="m-btn">
                <input type="radio" name="size_product" id="m-btn" value="m" />m
              </label>
              <label for="l-btn">
                <input type="radio" name="size_product" id="l-btn" value="l" />l
              </label>
              <label for="xl-btn">
                <input
                  type="radio"
                  name="size_product"
                  id="xl-btn"
                  value="xl"
                />
                xl
              </label>
            </div>
            <div
              className="quantity-plus-minus input-group my-4"
              style={{ height: "32px" }}
            >
              <label for="quantity" className="pe-2">
                Số lượng:
              </label>
              <i
                className="fa-solid fa-minus input-group-btn minus"
                onClick={minusQuantity}
              ></i>
              <input
                className="text-center"
                type="text"
                pattern="[0-9]*"
                min="1"
                value={quantity}
                onChange={changeQuantity}
                style={{ width: " 42px" }}
              />
              <i
                className="fa-solid fa-plus input-group-btn plus"
                onClick={plusQuantity}
              ></i>
            </div>
            <a
              className="btn "
              onClick={addCart}
              style={{ backgroundColor: "aqua" }}
            >
              Thêm vào giỏ hàng
            </a>
            {/* {{-- <button className="btn  ms-2" style="background-color: rgb(0, 255, 200);">Mua Ngay</button> --}} */}
            {/* <div className="mt-4">
              <h3>Mô tả:</h3>
              <h3 className="fs-6">description</h3>
            </div> */}
          </div>
          <div className="col-12 mt-4">
            <h4>Mô tả:</h4>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {product && product.description}
            </div>
          </div>
        </div>
        <hr />
        <nav>
          <div
            className="nav nav-tabs d-flex justify-content-center"
            id="nav-tab"
            role="tablist"
          >
            <button
              className="nav-link active"
              id="nav-product-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-home"
              type="button"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
            >
              SẢN PHẨM TƯƠNG TỰ
            </button>
            <button
              className="nav-link"
              id="nav-profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile"
              type="button"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="false"
            >
              Đánh giá
            </button>
            <button
              className="nav-link"
              id="nav-contact-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-contact"
              type="button"
              role="tab"
              aria-controls="nav-contact"
              aria-selected="false"
            >
              Contact
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-product-tab"
          >
            <h2 className="text-center my-4">SẢN PHẨM TƯƠNG TỰ</h2>
            <div className="row ">
              {products &&
                products.length > 0 &&
                products.map((row) => (
                  <div className="col-md-3 col-6">
                    <ProductItem product={row} />
                  </div>
                ))}
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            ...
          </div>
          <div
            className="tab-pane fade"
            id="nav-contact"
            role="tabpanel"
            aria-labelledby="nav-contact-tab"
          >
            ...
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
