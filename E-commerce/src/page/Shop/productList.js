import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GET_ALL } from "../../api/apiService";
import ProductItem from "../Product/productItem";
import CategoryShop from "./categoryShop";
import { Link } from "react-router-dom";
function ProductList() {
  const { id } = useParams("id");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;
  const search = queryParams.get("search");
  const [sortBy, setSortBy] = useState("productId");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);
  const [lastPage, setLastPage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState({});

  const [products, setProducts] = useState([]);
  let categoryId = queryParams.get("categoryId");

  useEffect(() => {
    setLoading(true);
    const params = {
      pageNumber: currentPage,
      pageSize: 8,
      sortBy: sortBy,
      sortOrder: sortOrder,
    };
    if (categoryId && categoryId != "null") {
      GET_ALL(`/stores/${id}/categories/${categoryId}/products`, params)
        .then((response) => {
          console.log(response);
          setProducts(response.content);
          setLastPage(response.lastPage);
          setTotalPages(response.totalPages);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      GET_ALL(`/stores/${id}/products`, params)
        .then((response) => {
          console.log(response);
          setProducts(response.content);
          setLastPage(response.lastPage);
          setTotalPages(response.totalPages);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [location, sortBy, sortOrder, currentPage]);

  const changeSort = (value) => {
    if (value != "") {
      setSortBy("price");
      setSortOrder(value);
    } else {
      setSortBy("productId");
      setSortOrder("asc");
    }
    console.log("aaaa", value);
  };

  const handlePageChange = (page) => {
    navigate(`/ListingGrid?page=${page}&categoryId=${categoryId}`);
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  const renderPageNumbers = () => {
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <Link
            className="page-link"
            to={`?page=${i}&categoryId=${categoryId}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Link>
        </li>
      );
    }
    return pageNumbers;
  };
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-3">
          <CategoryShop />
        </div>
        <div className="col-md-9 row">
          <div className="col-12">
            <div className=" d-flex justify-content-end align-items-center">
              <div>
                Sắp xếp theo:
                <select
                  className="sort-product ms-2 me-4"
                  onChange={(e) => changeSort(e.target.value)}
                >
                  <option value={""}>Phù hợp nhất</option>
                  <option value={"asc"}>Giá từ thấp tới cao</option>
                  <option value={"desc"}>Giá từ cao đến thấp</option>
                </select>
              </div>
              <div>
                Xem:
                <a style={{ marginLeft: "5px", marginRight: "8px" }}>
                  <i class="fa-sharp fa-solid fa-grid-2 fs-4"></i>
                </a>
                <a style={{ marginLeft: "5px" }}>
                  <i
                    class="fa-sharp fa-solid fa-list fs-4"
                    style={{ color: "grey" }}
                  ></i>
                </a>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap" >
            {products.map((pro) => {
              return (
                <div className="border-product">
                  <ProductItem product={pro} />
                </div>
              );
            })}
          </div>

          <div class="col-12 d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    <i class="fa-solid fa-angles-left"></i>
                  </button>
                </li>
                {renderPageNumbers()}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    <i class="fa-solid fa-angles-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
