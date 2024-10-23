import React, {  useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
function Footer() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <section className="footer">
      <div className="hd1-footer ">
        <div className="container p-4">
          <div className="row">
            <div className="col-md-3 col-12">
              <h5>THÔNG TIN</h5>
              <p>Công ty thời trang Your Fashion</p>
              <p>
                Địa chỉ: Store: 999 Tăng Nhơn Phú, Phường 99, Quận 9 , Tp.Hcm.
              </p>
              <p>
                Số điện thoại: <a href="">0585115932</a>
              </p>
              <p>
                Email: <a href="">Light@gmail.com</a>
              </p>
            </div>
            <div className="col-md-3 col-12">
              <h5>
                <a href="#">LIÊN HỆ</a>
              </h5>
              <ul>
                <li>
                  <a href="#">Giới thiệu</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Zalo</a>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-12">
              <h5>
                <a href="#">HỖ TRỢ KHÁCH HÀNG</a>
              </h5>
              <ul>
                <li>
                  <a href="#">Chính sách mua hàng</a>
                </li>
                <li>
                  <a href="#">Chính sách bảo hành</a>
                </li>
                <li>
                  <a href="#">Chính sách vận chuyển</a>
                </li>
                <li>
                  <a href="#">Chính sách đổi trả</a>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-12 text-center p-4">
              <ul>
                <li className="d-inline">
                  <a href="">
                    <i
                      className="fa-brands fa-facebook m-2"
                      style={{ fontSize: "40px" }}
                    ></i>
                  </a>
                </li>
                <li className="d-inline">
                  <a href="">
                    <i
                      className="fa-brands fa-facebook-messenger m-2"
                      style={{ fontSize: "40px" }}
                    ></i>
                  </a>
                </li>
                <li className="d-inline">
                  <a href="">
                    <i
                      className="fa-brands fa-instagram m-2"
                      style={{ fontSize: "40px" }}
                    ></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Footer;
