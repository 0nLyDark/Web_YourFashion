import React from "react";
import { useState } from "react";
import { formatCurrency } from "../Product/formatCurrency";
import { apiURL } from "../../api/apiConfig";
import { Link } from "react-router-dom";

function OrderItem(props) {
  const [status, setStatus] = useState(null);

  return (
    <>
      <div class="form-check form-switch">
        <input
          name="showorder"
          class="form-check-input"
          type="checkbox"
          role="switch"
          onChange={(e) => setStatus(e.target.checked)}
        />
        <label class="form-check-label" id="labelshoworder">
          Xem chi tiết
        </label>
      </div>
      <div className="row p-2 orderProduct">
        {status && props.orderItems.map((item) => (
          <div className="row my-2">
            <div className="col-4 col-md-2">
              <Link  >
                <img
                  src={apiURL + `products/image/${item.product.image}`}
                  style={{
                    width: "auto",
                    minWidth: "60px",
                    maxWidth: "100%",
                    borderRadius: "20px",
                  }}
                />
              </Link>
            </div>
            <div className="col-8 col-md-10">
              <div className="row">
                <div className="col-md-8">
                  <p className="mb-1">{item.product.productName}</p>
                  <span>
                    {formatCurrency(item.orderedProductPrice)} * {item.quantity}
                  </span>
                </div>
                <div className="col-md-4 text-end">
                  {formatCurrency(item.quantity * item.orderedProductPrice)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export default OrderItem;
