import React, { useEffect } from "react";
import { formatCurrency } from "../Product/formatCurrency";
import { Link } from "react-router-dom";
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
            className="img-1 rounded w-100 h-100"
          />
          <img
            src={`http://localhost:8080/api/public/products/image/${props.product.image}`}
            alt="{{ $product->image }}"
            className="img-2 rounded w-100 h-100"
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
          {props.product.productName}
        </Link>
      </div>

      <div className="product-item-price text-center mt-1">
        {props.product.discount == 0 ? (
          <strong>
            {formatCurrency(props.product.price)}
            {/* <sup>đ</sup> */}
          </strong>
        ) : (
          <>
            <strong style={{ marginRight: "10px" }}>
              {formatCurrency(props.product.specialPrice)}
              {/* <sup>đ</sup> */}
            </strong>
            <del style={{ color: "rgb(255, 160, 160)" }}>
              {formatCurrency(props.product.price)}
              {/* <sup>đ</sup> */}
            </del>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductItem;
