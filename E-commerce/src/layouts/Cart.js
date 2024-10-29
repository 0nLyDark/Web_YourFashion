import { useEffect, useState } from "react";
import { DELETE_ALL, DELETE_ID, GET_ID, PUT_EDIT } from "../api/apiService";
import { formatCurrency } from "../page/Product/formatCurrency";
import { apiURL } from "../api/apiConfig";
import CartNull from "./CartNull";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
function Cart() {
  const { deleteCart } = useCart();
  const { deleteCartAll } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [cartStore, setCartStore] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quantitys, setQuantitys] = useState({});
  const [listProduct, setListProduct] = useState([]);
  const [constProducts, setConstProducts] = useState([]);
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
            let newList = response.cartItems.map(
              (item) => item.product.productId
            );
            setConstProducts(newList);
            // setTotalAmount(response.totalPrice);
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
        setListProduct(listProduct.filter((item) => item != productId));
      })
      .catch((error) => console.error(error));
  };
  const checkOut = () => {
    if (checkOutStatus) {
      navigate(`/Checkout?productIds=${listProduct}`);
    } else {
      toast.warning("Giỏ hàng không hợp lệ, hãy cập nhật lại giỏ hàng !", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  useEffect(() => {
    let total = cartItems.reduce(function (previousValue, cartItem) {
      if (listProduct.includes(cartItem.product.productId)) {
        return (
          previousValue + cartItem.quantity * cartItem.product.specialPrice
        );
      } else {
        return previousValue;
      }
    }, 0);
    setTotalAmount(total);
  }, [listProduct, cartItems]);
  useEffect(() => {
    let listStore = [];
    cartItems.map((item) => {
      let check = listStore.some((store) => store.id == item.product.store.id);
      if (!check) {
        let store = {
          id: item.product.store.id,
          storeName: item.product.store.storeName,
        };
        listStore.push(store);
      }
    });
    setCartStore(listStore);
  }, [cartItems]);
  const changeProducts = (id) => {
    if (listProduct.includes(id)) {
      let newList = listProduct.filter((item) => item != id);
      setListProduct(newList);
    } else {
      setListProduct((prePro) => [...prePro, id]);
    }
  };
  const changeProductsAll = (event) => {
    let value = event.target.checked;
    if (value) {
      setListProduct(constProducts);
    } else {
      setListProduct([]);
    }
  };
  const deleteAll = () => {
    const cartId = localStorage.getItem("cartId");
    DELETE_ALL(`carts/${cartId}/products`, listProduct)
      .then((response) => {
        console.log("deleteCart", response);
      })
      .catch((error) => console.error(error));
    deleteCartAll(listProduct);
    let updatedQuantitys = quantitys;
    listProduct.map((proId) => {
      let { [proId]: removed, ...remainingQuantitys } = updatedQuantitys;
      updatedQuantitys = remainingQuantitys;
    });

    setQuantitys({});
    setCartItems(
      cartItems.filter(
        (cartItem) => !listProduct.includes(cartItem.product.productId)
      )
    );
    setListProduct([]);
  };
  return (
    <section
      className="content"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
    >
      <div className="container py-4">
        <h2 className="text-center mb-4">
          <strong>Giỏ Hàng</strong>
        </h2>

        <div className="content-cart w-100" style={{ minHeight: "500px" }}>
          {loading && cartItems.length > 0 && (
            <div>
              <div className="cart-header">
                <div className="text-center">
                  <input
                    type="checkbox"
                    checked={listProduct.length == constProducts.length}
                    onChange={changeProductsAll}
                  />
                </div>
                <div>
                  Sản Phẩm{" "}
                    {/* {!checkOutStatus && (
                      <span className="text-danger ms-2">
                        Hàng tồn kho không đủ vui lòng cập nhật lại giỏ hàng!
                      </span>
                    )} */}
                </div>
                <div className="text-center">Đơn Giá</div>
                <div className="text-center">Số Lượng</div>
                <div className="text-center">Số Tiền</div>
                <div className="text-center">Thao Tác</div>
              </div>
              {cartStore.map((store) => (
                <div className="cart-store" key={"store" + store.id}>
                  <div className="store-name">
                    <div className="text-center">
                      <input type="checkbox" />
                    </div>
                    <div>
                      <Link>{store.storeName}</Link>
                    </div>
                  </div>
                  {cartItems.map(
                    (row) =>
                      row.product.store.id == store.id && (
                        <div class="cart-item" key={row.product.productId}>
                          <div className="text-center">
                            <input
                              type="checkbox"
                              checked={listProduct.includes(
                                row.product.productId
                              )}
                              onChange={() =>
                                changeProducts(row.product.productId)
                              }
                            />
                          </div>
                          <div class="product-details">
                            <div>
                              <Link
                                to={`/productDetail/${row.product.productId}`}
                              >
                                <img
                                  className=""
                                  src={`${apiURL}products/image/${row.product.image}`}
                                  alt={row.product.image}
                                />
                              </Link>
                            </div>
                            <div className="ps-2">
                              <div class="title">{row.product.productName}</div>
                              <div class="description">
                                Tồn kho: {row.product.quantity}
                              </div>
                            </div>
                          </div>
                          <div class="price">
                            {row.product.discount != 0 && (
                              <span class="old-price">
                                {formatCurrency(row.product.price)}
                              </span>
                            )}
                            <span class="new-price">
                              {formatCurrency(row.product.specialPrice)}
                            </span>
                          </div>
                          <div class="quantity">
                            <div className=" quantity-plus-minus input-group d-flex justify-content-center">
                              <i
                                className="fa-solid fa-minus input-group-btn minus"
                                onClick={() => {
                                  minusQuantity(
                                    row.product.productId,
                                    quantitys[row.product.productId] ||
                                      row.quantity
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
                          </div>
                          <div class="total-price">
                            {formatCurrency(
                              row.product.specialPrice * row.quantity
                            )}
                          </div>
                          <div class="actions">
                            <a
                              onClick={(e) => {
                                deleteProductCart(
                                  row.product.productId,
                                  row.product.specialPrice * row.quantity
                                );
                              }}
                            >
                              Xóa
                            </a>
                          </div>
                        </div>
                      )
                  )}
                </div>
              ))}

              <div className="cart-footer">
                <div className="text-center">
                  <input
                    id="checkbox-cart-footer"
                    type="checkbox"
                    checked={listProduct.length == constProducts.length}
                    onChange={changeProductsAll}
                  />
                </div>
                <label htmlFor="checkbox-cart-footer">Chọn tất cả</label>
                <div className="text-center">
                  <a
                    className="btn text-black fa-blod"
                    onClick={deleteAll}
                    style={{ cursor: "pointer" }}
                  >
                    Xóa
                  </a>
                </div>
                <button onClick={updateCart} className="btn btn-secondary mx-4">
                  Cập nhật
                </button>
                <Link
                  to="/ListingGrid"
                  className="btn "
                  style={{ color: "white", backgroundColor: "#d8d8d8" }}
                >
                  Mua thêm
                </Link>

                <span className="text-end pe-4" style={{ fontSize: "18px" }}>
                  Tổng thanh toán:{" "}
                  <span
                    id="totalMoney"
                    style={{ color: "#e74c3c", fontWeight: "bold" }}
                  >
                    {formatCurrency(totalAmount)}
                  </span>
                </span>
                <a
                  onClick={checkOut}
                  className="btn "
                  style={{ color: "white", backgroundColor: "#e74c3c" }}
                >
                  Mua hàng
                </a>
              </div>
            </div>
          )}
          {loading && cartItems.length == 0 && <CartNull />}
        </div>
      </div>
    </section>
  );
}

export default Cart;
