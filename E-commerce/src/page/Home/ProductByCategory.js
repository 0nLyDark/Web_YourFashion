import React from "react";
import { useEffect, useState } from "react";
import { GET_ALL, GET_ID } from "../../api/apiService";
import ProductItem from "../Product/productItem";
import { Link } from "react-router-dom";
function ProductByCategory(props) {
  const categoryId = props.categoryId;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 4,
      sortBy: "productId",
      sortOrder: "desc",
    };
    GET_ALL(`categories/${categoryId}/products`, params)
      .then((response) => {
        setProducts(response.content);
        console.log("data", response);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
      });
    GET_ID("categories", categoryId)
      .then((item) => setCategories(item))
      .catch((error) => {
        console.error("Failed to fetch category:", error);
      });
  }, []);

  return (
    <>
      {products.length > 0 && (
        <section class="product-category py-4">
          <div class="container">
            <h2 class="text-center my-4">
              {categories && categories.categoryName}
            </h2>
            <div class="row">
              {products.map((row) => {
                return (
                  <div className="col-md-3 col-6">
                    <ProductItem product={row} />
                  </div>
                );
              })}
              <div class="col-12 text-center">
                <Link
                  to={`ListingGrid?categoryId=${categoryId}`}
                  class="btn btnsee-product"
                >
                  XEM TẤT CẢ
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ProductByCategory;
