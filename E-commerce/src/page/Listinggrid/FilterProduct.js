import { useEffect, useState } from "react";
import { GET_ALL } from "../../api/apiService";
import { useNavigate, useLocation, Link } from "react-router-dom";

function FilterProduct() {
  const [categoryId, setCategoryId] = useState(0);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 5,
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
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("categoryId") !== null) {
      setCategoryId(queryParams.get("categoryId"));
    }
  }, [location]);
  const filterByCategoryId = (id) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("categoryId", id);
    queryParams.delete("page");
    console.log(queryParams.toString());
    return queryParams.toString();
    // navigate(`/ListingGrid?${queryParams}`);
  };
  return (
    <ul className="list-group py-2">
      <h4 className="py-2">
        <strong>Danh mục</strong>
      </h4>
      <li className="fs-5">
        <Link to={"/ListingGrid"} onClick={(e) => setCategoryId(0)}>
          {categoryId === 0 ? (
            <strong style={{ color: "black" }}>Tất cả sản phẩm</strong>
          ) : (
            <strong>Tất cả sản phẩm</strong>
          )}
        </Link>
      </li>
      {categories.length > 0 &&
        categories.map((row) => {
          return (
            <li className="">
              <Link to={`/ListingGrid?${filterByCategoryId(row.categoryId)}`}>
                {categoryId == row.categoryId ? (
                  <strong style={{ color: "black" }}>{row.categoryName}</strong>
                ) : (
                  <strong>{row.categoryName}</strong>
                )}
              </Link>
              {row.categoryChildren.length !== 0 &&
                row.categoryChildren.map((item) => (
                  <li className="">
                    <Link
                      to={`/ListingGrid?${filterByCategoryId(item.categoryId)}`}
                    >
                      {categoryId == item.categoryId ? (
                        <span style={{ color: "black" }}>
                          {item.categoryName}
                        </span>
                      ) : (
                        <span>{item.categoryName}</span>
                      )}
                    </Link>
                  </li>
                ))}
            </li>
          );
        })}
    </ul>
  );
}

export default FilterProduct;
