import React from "react";
import { useEffect, useState } from "react";
import { GET_ALL } from "../../api/apiService";
import ProductItem from "../Product/productItem";
import { Link } from "react-router-dom";
const Deal = () => {
  // const { categoryName, categoryId } = category;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 4,
      sortBy: "productId",
      sortOrder: "desc",
      sale: true,
    };

    GET_ALL(`products`, params)
      .then((response) => {
        console.log("response", response.content);
        setProducts(response.content); // Set the products state
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error); // Handle errors
      });
  }, []);
  return (
    <>
      {products.length > 0 && (
        <section class="product-sale py-4">
          <div class="container">
            <h2 class="text-center my-4">FLASH SALE</h2>
            <div class="row">
              {products.map((row) => {
                return (
                  <div className="col-md-3 col-6">
                    <ProductItem product={row} />
                  </div>
                );
              })}
              <div class="col-12 text-center">
                <Link to="/ListingGrid" class="btn   btnsee-product">
                  XEM TẤT CẢ
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Deal;
