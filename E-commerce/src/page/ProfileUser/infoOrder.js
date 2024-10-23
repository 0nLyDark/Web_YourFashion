import React from "react";
import { useEffect, useState, useRef } from "react";
import { GET_ALL, GET_ID } from "../../api/apiService";
import { toast } from "react-toastify";
import { formatCurrency } from "../Product/formatCurrency";
import OrderItem from "./orderItems";
function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}
function InfoOrder() {
  const email = localStorage.getItem("email");
  const [orders, setOrders] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null); // Tham chiếu đến phần tử sẽ quan sát

  useEffect(() => {
    if (!email) return;
    const params = {
      pageNumber: pageNumber ?? 1,
      pageSize: pageSize,
      sortBy: "orderId",
      sortOrder: "asc",
    };
    GET_ALL(`users/${email}/orders`, params)
      .then((response) => {
        console.log(response);
        setOrders(response);
        if (response.length < pageSize) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        setHasMore(false);
        console.log("aaaaaaaaaa", error);
        toast.warning("Không lấy được dữ liệusss", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  }, [email]);
  const loadingOrders = () => {
    if (!hasMore) return;
    const params = {
      pageNumber: pageNumber + 1 ?? 1,
      pageSize: pageSize,
      sortBy: "orderId",
      sortOrder: "asc",
    };
    setPageNumber(pageNumber + 1);
    setIsLoading(true);

    GET_ALL(`users/${email}/orders`, params)
      .then((response) => {
        console.log(response);
        if (response.length < pageSize) {
          setHasMore(false);
        }
        setOrders((prevOrders) => [...prevOrders, ...response]); // Thêm đơn hàng mới vào mảng orders
        setIsLoading(false);
      })
      .catch((error) => {
        setHasMore(false);
        setIsLoading(false);
        console.error(error);
        toast.warning("Không lấy được dữ liệurrr", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadingOrders(); // Gọi API khi phần tử được cuộn vào vùng quan sát
        }
      },
      {
        rootMargin: "200px 0px", // Thêm khoảng cách 100px phía trên
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [isLoading]);
  return (
    <div className="">
      {orders.length > 0 &&
        orders.map((row) => (
          <div className="orderItem">
            <div>Mã đơn: {row.orderId}</div>
            <div>Tên người nhận: {row.deliveryName}</div>
            <div>SĐT liên hệ: {row.deliveryPhone}</div>
            <div>Ngày đặt hàng: {formatDate(row.orderDate)}</div>
            <div>
              Địa chỉ:{" "}
              {`${row.address.buildingName}, ${row.address.ward}, ${row.address.district}, ${row.address.city}`}
            </div>
            <div> Phương thức thanh toán: {row.payment.paymentMethod}</div>
            <OrderItem orderItems={row.orderItems} />
            <div className="row">
              <div className="col-md-6"></div>
              <div className="col-md-6 text-end pe-4 py-2">
                Tổng tiền: <strong>{formatCurrency(row.totalAmount)}</strong>
              </div>
            </div>
          </div>
        ))}
      <div>
        <div
          ref={loadMoreRef}
          style={{ height: "20px", backgroundColor: "transparent" }}
        />
        {isLoading && <div className="text-center" style={{ margin:"120px 0" }} >Loading more orders...</div>}
      </div>
    </div>
  );
}

export default InfoOrder;
