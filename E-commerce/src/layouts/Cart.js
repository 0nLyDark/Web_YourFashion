import { useEffect, useState } from "react";
import { DELETE_ID, GET_ID, PUT_EDIT } from "../api/apiService";
import { formatCurrency } from "../page/Product/formatCurrency";
import { apiURL } from "../api/apiConfig";
import CartNull from "./CartNull";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
function Cart() {
  const { deleteCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quantitys, setQuantitys] = useState({});
  const [checkOutStatus, setCheckOutStatus] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate
  const cartId = localStorage.getItem("cartId");
  const email = localStorage.getItem("email");
  useEffect(() => {
    for (let item of cartItems) {
      if (item.product.quantity < item.quantity) {
        setCheckOutStatus(false);
        return;
      }
    }
    setCheckOutStatus(true);
  }, [cartItems]);
  useEffect(() => {
    console.log("quantitys", quantitys);
  }, [quantitys]);
  const changeQuantitys = (event, id, qty) => {
    const value = parseInt(event.target.value, 10);

    // Kiểm tra giá trị nhập vào có hợp lệ hay không
    if (!isNaN(value) && value > 0) {
      if (qty && value > qty) {
        setQuantitys((prevState) => ({
          ...prevState,
          [id]: qty,
        }));
      } else {
        setQuantitys((prevState) => ({
          ...prevState,
          [id]: value,
        }));
      }
    } else if (event.target.value === "" || event.target.value === "0") {
      // Cho phép giá trị trống tạm thời trong khi người dùng nhập
      setQuantitys((prevState) => ({
        ...prevState,
        [id]: 1,
      }));
    }
  };
  const plusQuantity = (id, qty, qtyMax) => {
    if (qty < qtyMax) {
      setQuantitys((prevState) => ({
        ...prevState,
        [id]: qty + 1,
      }));
    } else {
      toast.info("Hàng tồn kho không đủ", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  const minusQuantity = (id, qty) => {
    if (qty > 1) {
      setQuantitys((prevState) => ({
        ...prevState,
        [id]: qty - 1,
      }));
    } else {
      toast.info("Số lượng tối thiểu là 1", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  useEffect(() => {
    setLoading(false);
    if (email && cartId) {
      GET_ID(`users/${email}/carts`, cartId)
        .then((response) => {
          if (response) {
            console.log(response);
            setCartItems(response.cartItems);
            setTotalAmount(response.totalPrice);
            setLoading(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(true);
        });
    }
  }, []);
  const updateCart = async () => {
    let bool = true;
    const newQuantitys = quantitys;
    for (const [key, value] of Object.entries(quantitys)) {
      await PUT_EDIT(`carts/${cartId}/products/${key}/quantity/${value}`, {})
        .then((response) => {
          if (response) {
            console.log("responseCart", response);
            setCartItems(response.cartItems);
            setTotalAmount(response.totalPrice);
            delete newQuantitys[key];
            console.log("updated product in cart success");
          }
        })
        .catch((error) => {
          console.error("Updated cart faield" + error);
          bool = false;
        });
    }
    if (bool == true) {
      toast.success("Cập nhật giỏ hàng thành công", {
        position: "top-center",
        autoClose: 2000,
      });
      setQuantitys(newQuantitys);
    } else {
      toast.warning("Cập nhật giỏ hàng thất bại", {
        position: "top-center",
        autoClose: 2000,
      });
      setQuantitys({});
    }
    // setLoading(false);
    console.log(quantitys);
  };
  const deleteProductCart = (productId, totalMoney) => {
    const cartId = localStorage.getItem("cartId");
    DELETE_ID(`carts/${cartId}/product/${productId}`)
      .then((response) => {
        console.log("deleteCart", response);
        deleteCart(productId);
        const { [productId]: removed, ...newQuantitys } = quantitys;
        setQuantitys(newQuantitys);
        setCartItems(
          cartItems.filter(
            (cartItem) => cartItem.product.productId != productId
          )
        );
        setTotalAmount(totalAmount - totalMoney);
      })
      .catch((error) => console.error(error));
  };
  const checkOut = () => {
    if (checkOutStatus) {
      navigate("/Checkout");
    } else {
      toast.warning("Giỏ hàng không hợp lệ, hãy cập nhật lại giỏ hàng !", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  return (
    <section className="content">
      <div className="container py-4">
        <h2 className="text-center mb-4">Giỏ Hàng Của Tôi</h2>
        <div className="content-cart" style={{ minHeight: "500px" }}>
          {loading && cartItems.length > 0 && (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th style={{ width: "80px" }} className="text-center">
                    Mã SP
                  </th>
                  <th style={{ width: "150px",textAlign:'center' }}>Hình</th>
                  <th>Tên sản phẩm</th>
                  <th className="text-center" style={{ width: "150px" }}>
                    Số lượng
                  </th>
                  <th style={{ minWidth: "120px" }}>Giá</th>
                  <th style={{ width: "100px" }} >Giảm giá</th>

                  <th style={{ minWidth: "120px" }}>Thành tiền</th>
                  <th style={{ width: " 50px" }}>
                    <a
                      onclick="handleDeleteAllCart()"
                      className="btn text-danger "
                    >
                      <i className="fas fa-trash "></i>
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems &&
                  cartItems.map((row) => (
                    <tr>
                      <td style={{ width: "40px" }} className="text-center">
                        {row.product.productId}
                      </td>
                      <td style={{ width: "150px" }}>
                        <Link to={`/productDetail/${row.product.productId}`}>
                          <img
                            className="img-fluid w-100"
                            src={`${apiURL}products/image/${row.product.image}`}
                            alt={row.product.image}
                          />
                        </Link>
                      </td>
                      <td>
                        <p>{row.product.productName}</p>
                        <span>Tồn kho: {row.product.quantity}</span>
                      </td>

                      <td className="text-center " style={{ width: "" }}>
                        <div className=" quantity-plus-minus input-group d-flex justify-content-center">
                          <i
                            className="fa-solid fa-minus input-group-btn minus"
                            onClick={() => {
                              minusQuantity(
                                row.product.productId,
                                quantitys[row.product.productId] || row.quantity
                              );
                            }}
                          ></i>
                          <input
                            className="text-center"
                            type="text"
                            min="1"
                            value={
                              quantitys[row.product.productId]
                                ? quantitys[row.product.productId]
                                : row.quantity
                            }
                            style={{ width: "42px" }}
                            onChange={(e) =>
                              changeQuantitys(
                                e,
                                row.product.productId,
                                row.product.quantity
                              )
                            }
                          />
                          <i
                            className="fa-solid fa-plus input-group-btn plus"
                            onClick={(e) => {
                              plusQuantity(
                                row.product.productId,
                                quantitys[row.product.productId] ||
                                  row.quantity,
                                row.product.quantity
                              );
                            }}
                          ></i>
                        </div>
                        <div style={{ color: "red" }}>
                          {row.quantity > row.product.quantity
                            ? "Hàng tồn kho không đủ!"
                            : ""}
                        </div>
                        {/* {{-- <input style={{width: "60px"}} type="number" min='1' value="{{ $row_cart['qty'] }}" > --}} */}
                      </td>
                      <td>{formatCurrency(row.product.price)}</td>
                      <td>
                        {row.product.discount > 0
                          ? `${row.product.discount} %`
                          : ""}{" "}
                      </td>

                      <td name="total">
                        {formatCurrency(
                          row.product.specialPrice * row.quantity
                        )}
                      </td>
                      <td style={{ width: "50px" }}>
                        <a
                          onClick={(e) => {
                            deleteProductCart(
                              row.product.productId,
                              row.product.specialPrice * row.quantity
                            );
                          }}
                          className="btn text-black"
                        >
                          <i className="fa-solid fa-x"></i>
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="4" style={{ color: "white" }}>
                    <Link
                      to="/ListingGrid"
                      className="btn "
                      style={{ color: "white", backgroundColor: "#d8d8d8" }}
                    >
                      Mua thêm
                    </Link>
                    <button
                      onClick={updateCart}
                      className="btn btn-secondary mx-4"
                    >
                      Cập nhật
                    </button>
                    <a onClick={checkOut} className="btn btn-danger">
                      Thanh toán
                    </a>
                    {!checkOutStatus && (
                      <span className="text-danger ms-2">
                        Hàng tồn kho không đủ vui lòng cập nhật lại giỏ hàng!
                      </span>
                    )}
                  </th>
                  <th colspan="3" className="text-end">
                    <span className="fs-5">
                      Tổng tiền:{" "}
                      <span id="totalMoney">{formatCurrency(totalAmount)}</span>
                    </span>
                  </th>
                </tr>
              </tfoot>
            </table>
          )}
          {loading && cartItems.length == 0 && <CartNull />}
        </div>
      </div>
    </section>
  );
}

export default Cart;
