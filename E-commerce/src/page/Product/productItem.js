import React, { useEffect } from "react";
import { formatCurrency } from "../Product/formatCurrency";
import { Link } from "react-router-dom";
const truncate = (str, maxLength) => {
  // Kiểm tra nếu str là null hoặc undefined, hoặc không phải là chuỗi
  if (typeof str !== "string") {
    return ""; // Trả về chuỗi rỗng hoặc xử lý phù hợp
  }

  // Thực hiện cắt ngắn chuỗi
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};
function ProductItem(props) {
  // useEffect(() => {
  //   console.log("props", props);
  // }, []);

  return (
    <div className="product-item ">
      <div className="product-item-image">
        <Link to={`/ProductDetail/${props.product.productId}`}>
          <img
            src={`http://localhost:8080/api/public/products/image/${props.product.image}`}
            alt="{{ $product->image }}"
            className="img-1  w-100 h-100"
          />
          <img
            src={`http://localhost:8080/api/public/products/image/${props.product.image}`}
            alt="{{ $product->image }}"
            className="img-2  w-100 h-100"
          />
        </Link>
        {/* {{-- <div className="product-item-action">
            <a href="" className="addcart"><i className="fas fa-shopping-cart"></i></a>
            <a href="" className="showdetail"><i className="fas fa-eye"></i></a>
        </div> --}} */}
      </div>
      <div className="product-item-name text-center">
        {/* <a href="{{ route('site.product.detail',['slug'=>$product->slug]) }}">{{ Str::upper($product->name) }}</a> */}
        <Link to={`/ProductDetail/${props.product.productId}`}>
          {truncate(props.product.productName, 45)}
        </Link>
      </div>

      <div className="product-item-price text-center mt-1 mb-3" >
        {props.product.discount == 0 ? (
          <strong>
            {formatCurrency(props.product.price)}
            {/* <sup>đ</sup> */}
          </strong>
        ) : (
          <div className="d-flex flex-wrap justify-content-center">
            <strong style={{ marginRight: "10px", float: "left" }}>
              {formatCurrency(props.product.specialPrice)}
              {/* <sup>đ</sup> */}
            </strong>
            <del style={{ color: "rgb(255, 160, 160)", float: "left" }}>
              {formatCurrency(props.product.price)}
              {/* <sup>đ</sup> */}
            </del>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductItem;
