import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { GET_ALL } from "../../api/apiService";

function CategoryShop() {
  const { id } = useParams("id");
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const params = {
    pageNumber: 1,
    pageSize: 100,
    // sortBy: sortBy,
    // sortOrder: sortOrder,
  };
  useEffect(() => {
    GET_ALL(`/stores/${id}/categories`,params)
      .then((response) => {
        setCategories(response.content);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const changeCategoryId = (id) => {
    let queryParams = new URLSearchParams(location.search);
    queryParams.set("categoryId", id);
    return `${location.pathname}?${queryParams.toString()}`;
  };

  return (
    <div>
      <strong style={{ fontSize: "18px" }}>Danh mục</strong>
      <ul className="categoryShop">
        {categories.map((row) => (
          <li>
            <Link to={changeCategoryId(row.categoryId)}>
              {row.categoryName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryShop;
