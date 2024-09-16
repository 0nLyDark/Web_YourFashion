import { Link } from "react-router-dom";

function CartNull() {
  return (
    <div class="text-center">
      <img
        class="img-fluid"
        src={require("../assets/image/cart_null.webp")}
        alt=""
      />
      <h5>Giỏ hàng của bạn đang trống</h5>
      <p>Hãy thêm sản phẩm vào giỏ hàng nhé</p>
      <Link
        class="btn form-control"
        to="/ListingGrid"
        style={{ color: "white", background: "black", maxWidth: "250px" }}
      >
        <strong>Mua hàng ngay</strong>
      </Link>
    </div>
  );
}

export default CartNull
