import { apiURL } from "../../api/apiConfig";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GET_ID } from "../../api/apiService";
function InfoShop() {
  const [store, setStore] = useState({});
  const { id } = useParams("id");
  useEffect(() => {
    GET_ID("/stores", id)
      .then((response) => {
        setStore(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);
  return (
    <div className="p-4 bg-info" style={{ borderRadius: "25px" }}>
      <div className="border-info-shop">
        <div>
          <div className="logo-shop">
            <img src={`${apiURL}stores/image/${store.logo}`} alt={store.logo} />
          </div>
        </div>
        <div className="info-shop">
          <div className="fs-4 ">
            <strong style={{ fontSize: "16px" }}>{store.storeName}</strong>
          </div>
          <div style={{ fontSize: "14px" }}>290 Followers</div>
          <div style={{ fontSize: "12px" }}>98% Đánh giá tích cực</div>
        </div>

        <Link className="btn-shop" style={{ border: "none", padding: "12px" }}>
          <div>
            <i class="fa-solid fa-messages"></i>
          </div>
          <div>Chat Ngay</div>
        </Link>
        <Link
          className="btn-shop"
          style={{ border: "none", padding: "12px" }}
          to={"/shop"}
        >
          <div>
            <i class="fa-thin fa-plus"></i>
            <i class="fa-thin fa-store"></i>
          </div>
          <div>Theo dõi</div>
        </Link>
      </div>
    </div>
  );
}

export default InfoShop;
