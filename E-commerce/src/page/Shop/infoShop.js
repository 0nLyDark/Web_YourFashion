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
    <div className="row p-4 bg-info" style={{ borderRadius: "25px" }}>
      <div className="col-md-5 ">
        <div
          className="row bg-white p-2"
          style={{ margin: "0px", borderRadius: "15px" }}
        >
          <div
            className="col-md-6 col-12 row"
            style={{ margin: "0px", padding: "0px" }}
          >
            <div className="logo-shop col-5">
              <img
                src={`${apiURL}stores/image/${store.logo}`}
                alt={store.logo}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="col-7" style={{ padding: "0px" }}>
              <div className="fs-4 ">
                <strong style={{ fontSize: "16px" }}>{store.storeName}</strong>
              </div>
              <div style={{ fontSize: "14px" }}>290 Followers</div>
              <div style={{ fontSize: "12px" }}>98% Đánh giá tích cực</div>
            </div>
          </div>
          <div
            className="col-md-6 col-12 row"
            style={{ margin: "0px", padding: "5px" }}
          >
            <Link
              className="btn-shop text-center col-6"
              style={{ border: "none", padding: "12px" }}
            >
              <div>
                <i class="fa-solid fa-messages"></i>
              </div>
              <div>Chat Ngay</div>
            </Link>
            <Link
              className="btn-shop text-center col-6"
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
      </div>
    </div>
  );
}

export default InfoShop;
