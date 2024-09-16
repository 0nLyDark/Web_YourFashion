import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GET_ALL, GET_ID } from "../../api/apiService";
import ProductItem from "../Product/productItem";
import FilterProduct from "./FilterProduct";
const SectionContent = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;
  //   const [categoryId,setCategoryId] = queryParams.get("categoryId");
  const categoryId = queryParams.get("categoryId");
  const search = queryParams.get("search");
  const [numItems, setNumItems] = useState(4);

  // const numItems = 4;

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
  const [sortBy, setSortBy] = useState("productId"); // Hoặc giá trị mặc định từ props nếu có
  const [sort, setSort] = useState("asc"); // Hoặc giá trị mặc định từ props nếu có
  const [grid, setGrid] = useState("4"); // Mặc định là 3 cột
  const handleGridChange = (event) => {
    let value = event.target.value;
    setGrid(value); // Cập nhật state
    setNumItems(value);
    // Thực hiện các thao tác khác nếu cần
  };
  const changeSort = (event) => {
    let value = event.target.value;
    if (value === "") {
      setSortBy("productId");
      setSort("desc");
    }
    if (value === "newest") {
      setSortBy("createdAt");
      setSort("desc");
    }
    if (value === "oldest") {
      setSortBy("createdAt");
      setSort("asc");
    }
    if (value === "asc") {
      setSortBy("price");
      setSort("asc");
    }
    if (value === "desc") {
      setSortBy("price");
      setSort("desc");
    }
  };
  useEffect(() => {
    setLoading(true);
    const params = {
      pageNumber: currentPage,
      pageSize: numItems,
      sortBy: sortBy,
      sortOrder: sort,
      categoryId: categoryId !== null && categoryId !== "null" ? categoryId : 0,
      // sale: false,
    };
    // if(search )
    console.log("search:  ", search);
    console.log("category:  ", categoryId);

    if (search) {
      GET_ALL(`products/keyword/${search}`, params)
        .then((response) => {
          setProducts(response.content);
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
          setLoading(false);
          console.log("data", response);
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
          setLoading(false);
        });
      if (categoryId !== null && categoryId !== "null") {
        GET_ID("categories", categoryId)
          .then((item) => setCategories(item))
          .catch((error) => {
            console.error("Failed to fetch category:", error);
          });
      }
      // setCategories({ categoryName: `Tìm kiếm: ${search} ` });
    } else {
      if (categoryId !== null && categoryId !== "null") {
        GET_ALL(`categories/${categoryId}/products`, params)
          .then((response) => {
            setProducts(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
            setLoading(false);
            console.log("data", response);
          })
          .catch((error) => {
            console.error("Failed to fetch products:", error);
            setLoading(false);
          });
        GET_ID("categories", categoryId)
          .then((item) => setCategories(item))
          .catch((error) => {
            console.error("Failed to fetch category:", error);
          });
      } else {
        GET_ALL("products", params)
          .then((response) => {
            setProducts(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
            setLoading(false);
            console.log("data", response);
          })
          .catch((error) => {
            console.error("Failed to fetch products:", error);
            setLoading(false);
          });
        setCategories(null);
      }
    }
  }, [categoryId, search, currentPage, sortBy, sort, numItems]);
  return (
    <>
      <section className="content">
        <div className="container py-4 ">
          <div className="row">
            <div className="col-12">
              <img src="{{ asset('image/') }}" alt="" className="img-fluid" />
            </div>
          </div>
          <div className="row">
            <div className="filter col-lg-3">
              <FilterProduct />
            </div>
            <div className="col-lg-9">
              <div className="row filter-name text-center py-4">
                <h2>
                  {search
                    ? `Tìm kiếm: ${search}`
                    : categories
                    ? categories.categoryName
                    : "Tất cả sản phẩm"}
                </h2>
              </div>
              {/* <x-filter :sort="$sort" :grid="$grid" /> */}

              <div className="filter-product pt-2 d-flex justify-content-between">
                <div className="">
                  <span>Lọc theo: {categories && categories.categoryName}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <div>
                    <select onChange={changeSort}>
                      <option value="">Sắp xếp</option>
                      <option value="newest">Sản phẩm mới nhất</option>
                      <option value="oldest">Cũ {"->"} Mới nhất</option>
                      {/* <option value="sale" >
                      Sản phẩm sale
                    </option> */}
                      <option value="asc">Giá tăng dần</option>
                      <option value="desc">Giá giảm dần</option>
                    </select>
                  </div>
                  <div className="grid mx-2 d-md-block d-none">
                    <input
                      class="mx-2"
                      value="4"
                      type="radio"
                      name="grid_product"
                      id="grid1"
                      checked={grid === "4"}
                      onChange={handleGridChange}
                    />
                    <label htmlFor="grid1" style={{ marginRight: "5px" }}>
                      <i className="fa-solid fa-grid fs-4"></i>
                    </label>
                    <input
                      class=""
                      value="3"
                      type="radio"
                      name="grid_product"
                      id="grid2"
                      checked={grid === "3"}
                      onChange={handleGridChange}
                    />
                    <label htmlFor="grid2">
                      <i className="fa-solid fa-grid-2 fs-4"></i>
                    </label>
                  </div>
                </div>
              </div>
              <div class="row product" style={{ minHeight: "600px" }}>
                {!loading &&( products.length > 0 ? (
                  grid === "3" ? (
                    products.map((row) => {
                      return (
                        <div class="col-4">
                          <ProductItem product={row} />
                        </div>
                      );
                    })
                  ) : (
                    products.map((row) => {
                      return (
                        <div class="col-md-3 col-6">
                          <ProductItem product={row} />
                        </div>
                      );
                    })
                  )
                ) : (
                  <p className="text-center fs-3 text-info">
                    Không có sản phẩm cần tìm !!!
                  </p>
                ))}
                {loading && <p>loading...</p>}
                <div class="col-12 d-flex justify-content-center">
                  <nav>
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
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
        </div>
      </section>
    </>
  );
};

export default SectionContent;
