import axios from "axios";
import React from "react";
import logoVNPay from "../assets/image/logoVNPay.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { GET_ID, POST_ADD } from "../api/apiService";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { apiURL } from "../api/apiConfig";
import { formatCurrency } from "../page/Product/formatCurrency";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axiosInstance from "../api/axiosConfig";
import { Link } from "react-router-dom";
import { Button } from "bootstrap";
function CheckOut() {
  const email = localStorage.getItem("email");
  const cartId = localStorage.getItem("cartId");
  const { setCartItems } = useCart();

  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [note, setNote] = useState("");

  const [codeCity, setCodeCity] = useState(0);
  const [codeDistrict, setCodeDistrict] = useState(0);
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [cartItemss, setCartItemss] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [urlPaymentVNPay, setUrlPaymentVNPay] = useState("");
  const statusCheckOut = useRef(false);
  const amount = useRef(0);
  const handleApproveRef = useRef(null);
  useEffect(() => {
    amount.current = converVNDToUSD(totalAmount);
  }, [totalAmount]);
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/")
      .then((response) => {
        console.log(response);
        setCitys(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    if (codeCity != 0) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${codeCity}/?depth=2`)
        .then((response) => {
          console.log(response);
          setCodeDistrict(0);
          setDistrict("");
          setDistricts(response.data.districts);
          setCity(response.data.name);
          setWard("");
          setWards([]);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setDistrict("");
      setDistricts([]);
      setWard("");
      setWards([]);
    }
  }, [codeCity]);
  useEffect(() => {
    if (codeDistrict != 0) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${codeDistrict}/?depth=2`)
        .then((response) => {
          console.log(response);
          setWard("");
          setWards(response.data.wards);
          setDistrict(response.data.name);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setWard("");
      setWards([]);
    }
  }, [codeDistrict]);
  const inputPhone = (e) => {
    const value = e.target.value;
    // Kiểm tra chỉ cho phép nhập số và tối đa 10-11 ký tự
    if (/^\d{0,11}$/.test(value)) {
      setDeliveryPhone(value);
    }
  };
  useEffect(() => {
    if (email) {
      GET_ID(`users/email`, email)
        .then((response) => {
          if (response) {
            console.log("fffffffffffff", response.cart.cartItems);
            setCartItemss(response.cart.cartItems);
            setTotalAmount(response.cart.totalPrice);
            setDeliveryName(response.firstName + " " + response.lastName);
            setDeliveryPhone(response.mobileNumber);
            setBuildingName(response.address.buildingName);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [email]);
  useEffect(() => {
    console.log("USD:", converVNDToUSD(totalAmount));

    if (
      email &&
      deliveryName != "" &&
      deliveryPhone.length == 10 &&
      city != "" &&
      district != "" &&
      ward != "" &&
      buildingName != ""
    ) {
      statusCheckOut.current = true;
    } else {
      statusCheckOut.current = false;
    }
  }, [email, deliveryName, deliveryPhone, city, district, ward, buildingName]);
  const handleOrder = () => {
    if (statusCheckOut.current) {
      const data = {
        orderId: 0,
        deliveryName: deliveryName,
        deliveryPhone: deliveryPhone,
        note: note,
        address: {
          addressId: 0,
          ward: ward,
          buildingName: buildingName,
          city: city,
          district: district,
          country: "Việt Nam",
          pincode: "999999",
        },
      };
      POST_ADD(
        `/users/${email}/carts/${cartId}/payments/Cash on Delivery/order`,
        data
      )
        .then((response) => {
          setCartItems([]);
          setCartItemss([]);
          setTotalAmount(0);
          toast.success("Chúc mừng bạn đã đặt hàng thành công", {
            position: "top-center",
            autoClose: 2000,
          });
        })
        .catch((error) => {
          console.log(error);
          toast.error("Đơn đặt hàng đã thất bại", {
            position: "top-center",
            autoClose: 2000,
          });
        });
    } else {
      alert("Hãy điền đầy đủ thông tin vận chuyển!");
    }
  };
  useEffect(() => {
    handleApproveRef.current = async (orderId) => {
      if (statusCheckOut.current) {
        const data = {
          orderId: 0,
          deliveryName: deliveryName,
          deliveryPhone: deliveryPhone,
          note: note,
          address: {
            addressId: 0,
            ward: ward,
            buildingName: buildingName,
            city: city,
            district: district,
            country: "Việt Nam",
            pincode: "999999",
          },
        };
        POST_ADD(
          `/users/${email}/carts/${cartId}/payments/Payment Online/order`,
          data
        )
          .then((response) => {
            setCartItems([]);
            setCartItemss([]);
            setTotalAmount(0);
            toast.success("Chúc mừng bạn đã đặt hàng thành công", {
              position: "top-center",
              autoClose: 2000,
            });
          })
          .catch((error) => {
            console.log(error);
            alert(
              "Bạn đã thanh toán thành công nhưng đơn đặt hàng đã thất bại. Hãy liên hệ ngay qua hotline:1199 8888 để được hỗ trợ !"
            );
          });
      } else {
        alert("Hãy điền đầy đủ thông tin vận chuyển!");
      }
    };
  }, [email, deliveryName, deliveryPhone, city, district, ward, buildingName]);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const vnpResponseCode = queryParams.get("vnp_ResponseCode");
  const vnpBankTranNo = queryParams.get("vnp_BankTranNo");
  useEffect(() => {
    if (vnpResponseCode) {
      if (vnpResponseCode == "00") {
        const data = JSON.parse(localStorage.getItem("order"));
        if (data) {
          data["payment"] = {
            paymentId: 0,
            paymentMethod: "",
            paymentCode: vnpBankTranNo,
          };
          POST_ADD(
            `/users/${email}/carts/${cartId}/payments/Payment Online VNPay/order`,
            data
          )
            .then((response) => {
              setCartItems([]);
              setCartItemss([]);
              setTotalAmount(0);
              toast.success("Chúc mừng bạn đã đặt hàng thành công", {
                position: "top-center",
                autoClose: 2000,
              });
            })
            .catch((error) => {
              console.log(error);
              alert(
                "Bạn đã thanh toán thành công nhưng đơn đặt hàng đã thất bại. Hãy liên hệ ngay qua hotline:1199 8888 để được hỗ trợ !"
              );
            });
        }
      } else {
        alert("Thanh toán thất bại đã xảy ra lỗi giao dịch!");
      }
      localStorage.removeItem("order");
      navigate("/CheckOut");
    }
  }, []);
  const handleOrderVNPay = () => {
    if (statusCheckOut.current) {
      const data = {
        orderId: 0,
        deliveryName: deliveryName,
        deliveryPhone: deliveryPhone,
        note: note,
        address: {
          addressId: 0,
          ward: ward,
          buildingName: buildingName,
          city: city,
          district: district,
          country: "Việt Nam",
          pincode: "999999",
        },
      };
      localStorage.setItem("order", JSON.stringify(data));
      axiosInstance
        .get(`/payment/create_payment/${totalAmount}`)
        .then((response) => {
          window.location.href = response.data.url; // Chuyển hướng đến VNPay
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Hãy điền đầy đủ thông tin vận chuyển!");
    }
  };
  const converVNDToUSD = (price) => {
    const USD = (price / 24000).toFixed(2);
    return USD;
  };
  return (
    <section className="content">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-6 my-2">
            <h2 className="text-center mb-4">Thông tin vận chuyển</h2>
            <div className="mb-3">
              <label for="deliveryName">Họ tên người nhận:</label>
              <input
                type="text"
                name="deliveryName"
                id="deliveryName"
                value={deliveryName}
                onChange={(e) => setDeliveryName(e.target.value)}
                className="form-control"
                placeholder="Nhập họ tên"
              />
            </div>
            <div className="row">
              <div className="col-lg-7 mb-2">
                <label for="deliveryEmail">Email:</label>
                <input
                  type="text"
                  name="deliveryEmail"
                  id="deliveryEmail"
                  value={email && email}
                  className="form-control"
                  placeholder="Nhập email"
                  disabled
                />
              </div>
              <div className="col-lg-5 mb-2">
                <label for="deliveryPhone">Điện thoại người nhận:</label>
                <input
                  type="text"
                  name="deliveryPhone"
                  id="deliveryPhone"
                  oninput="allowNumber(event)"
                  value={deliveryPhone}
                  onChange={(e) => inputPhone(e)}
                  className="form-control"
                  maxlength="10"
                  placeholder="Nhập điện thoại"
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="row">
                <div className="col-md-4">
                  <label for="city">Tỉnh / thành:</label>
                  <select
                    id="city"
                    className="form-control"
                    value={codeCity}
                    onChange={(e) => {
                      setCodeCity(e.target.value);
                    }}
                  >
                    <option value={0}>Chọn tỉnh / thành</option>
                    {citys.map((city) => (
                      <option value={city.code}>{city.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label for="district">Quận / huyện:</label>
                  <select
                    id="district"
                    className="form-control"
                    value={codeDistrict}
                    onChange={(e) => {
                      setCodeDistrict(e.target.value);
                    }}
                  >
                    <option value={0}>Chọn quận / huyện</option>
                    {districts.map((district) => (
                      <option value={district.code}>{district.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label for="ward">Phường / xã:</label>
                  <select
                    id="ward"
                    className="form-control"
                    value={ward}
                    onChange={(e) => {
                      setWard(e.target.value);
                    }}
                  >
                    <option value="">Chọn phường / xã</option>
                    {wards.map((ward) => (
                      <option value={ward.name}>{ward.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label for="buildingName ">Địa chỉ:</label>
              <input
                type="text"
                name="buildingName "
                id="buildingName "
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                className="form-control"
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="mb-3">
              <label for="note">Ghi chú:</label>
              <textarea
                type="text"
                name="note"
                id="note"
                rows="4"
                className="form-control"
                placeholder="Nhập ghi chú"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </div>
            <div className="row">
              <div className="col-md-6 col-12 my-4"></div>
              <div className="col-md-6 col-12 my-4 text-end">
                <button
                  type="submit"
                  onClick={handleOrder}
                  className="btn bg-black text-white fROm-control"
                  style={{ width: "100%", maxWidth: " 250px" }}
                >
                  <strong>ĐẶT HÀNG</strong>
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <button
                  onClick={handleOrderVNPay}
                  className="btn"
                  style={{ border: "none" }}
                >
                  <img
                    src={require("../assets/image/logoVNPay.png")}
                    style={{ width: "150px", height: "75px" }}
                    className="img-fluid"
                    alt="aaaaaaaaa"
                  />
                </button>
              </div>
              <div className="col-md-6">
                <PayPalButtons
                  style={{ color: "silver" }}
                  onClick={(data, actions) => {
                    if (statusCheckOut.current) {
                      return actions.resolve();
                    } else {
                      alert("Hãy nhập đầy đủ thông tin vận chuyển");
                      return actions.reject();
                    }
                  }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          description: `Thanh toán đơn hàng của email: ${email}`,
                          amount: {
                            // currency_code:"VND",
                            // value: 10.0,
                            value: amount.current,
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    const order = await actions.order.capture();
                    console.log("order", order);
                    handleApproveRef.current(data.orderID);
                  }}
                  onCancel={() => {}}
                  onError={(error) => {
                    console.error("Thanh toán đã xảy ra lỗi: ", error);
                    alert("Thanh toán đã xảy ra lỗi: ", error);
                  }}
                />
              </div>
            </div>
            {/* @else
                        <p>Bạn đã có tài khoản? <a href="{{ route('site.customer.getlogin') }}">Đăng Nhập</a></p>
                    @endif */}
          </div>
          <div className="col-md-6 my-2">
            <h2 className="text-center mb-4">Thông tin đơn hàng</h2>
            <table className="table ">
              <thead>
                <tr>
                  <th style={{ width: "150px" }} className="text-center">
                    Hình
                  </th>
                  <th>Tên sản phẩm</th>
                  {/* {{-- <th className="text-center">Số lượng</th>
                                <th>Giá</th> --}} */}
                  <th style={{ minWidth: "120px" }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {cartItemss.map((cartItem) => (
                  <tr>
                    <td style={{ width: "150px" }}>
                      <img
                        className="img-fluid w-100"
                        src={
                          apiURL + `products/image/${cartItem.product.image}`
                        }
                        alt=""
                      />
                    </td>
                    <td>
                      <strong>{cartItem.product.productName}</strong>
                      {/* <p style={{ marginBottom: "0px " }}>Mã sp:</p> */}
                      <p>
                        {formatCurrency(cartItem.product.specialPrice)} *{" "}
                        {cartItem.quantity}
                        <sup></sup>
                      </p>
                    </td>

                    <td name="total">
                      {formatCurrency(
                        cartItem.product.specialPrice * cartItem.quantity
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="5" className="text-end">
                    <span className="fs-5">
                      Tổng tiền:{" "}
                      <span id="totalMoney">{formatCurrency(totalAmount)}</span>
                      <sup>đ</sup>
                    </span>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckOut;
