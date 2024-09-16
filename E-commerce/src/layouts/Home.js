import React from "react";
import Slider from "../page/Home/Slider";
import Deal from "../page/Home/Deal";
import ProductByCategory from "../page/Home/ProductByCategory";

function Home(props) {
  return (
    <>
      <Slider />
      <Deal />
      <ProductByCategory categoryId={1} />
      <ProductByCategory categoryId={2} />
      <ProductByCategory categoryId={3} />
      <section style={{ borderTop: "1px grey solid" }} className="mt-5">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-6 col-md-6 col-12 py-4">
              <div className="row">
                <div className="col-3">
                  <img
                    src={require("../assets/image/icon__1.webp")}
                    alt="alt image"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="col-9">
                  <h6>Miễn phí vận chuyển</h6>
                  <p>Miễn phí đơn hàng từ 699.000đ</p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 col-12 py-4 ">
              <div className="row">
                <div className="col-3">
                  <img
                    src={require("../assets/image/icon__2.webp")}
                    alt="alt image"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="col-9">
                  <h6>Miễn phí cước đổi hàng</h6>
                  <p>Đổi trả hàng sau 7 ngày nếu không vừa ý</p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 col-12 py-4 ">
              <div className="row">
                <div className="col-3">
                  <img
                    src={require("../assets/image/icon__3.webp")}
                    alt="alt image"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="col-9">
                  <h6>Tổng Đài Bán Hàng Miễn Phí</h6>
                  <p>Gọi 1800.0000 để được tư vấn</p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 col-12 py-4 ">
              <div className="row">
                <div className="col-3">
                  <img
                    src={require("../assets/image/icon__4.webp")}
                    alt="alt image"
                    className="img-fluid w-100"
                  />
                </div>
                <div className="col-9">
                  <h6>Thanh toán đa dạng</h6>
                  <p>Phương thức thanh toán đa dạng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
