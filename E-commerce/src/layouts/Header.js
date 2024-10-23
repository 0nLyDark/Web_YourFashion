import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead
import Menu from "./Menu";
import { useCart } from "../context/CartContext";
function Header() {
  const headerRef = useRef(null);
  const headerTopRef = useRef(null);
  const searchWrapRef = useRef(null);
  const lastScrollTop = useRef(0); // Biến lưu vị trí cuộn trước đó
  // useEffect để thay thế componentDidMount và componentWillUnmount
  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current;
      const headerTop = headerTopRef.current;

      if (header && headerTop) {
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop.current) {
          // Kéo xuống
          header.style.top = `-${header.offsetHeight}px`;
          closeSearch();
        } else {
          // Kéo lên
          if (currentScroll === 0) {
            // Kéo lên trên cùng
            header.style.top = "0";
          } else {
            if (currentScroll < lastScrollTop.current - 30) {
              header.style.top = `-${headerTop.offsetHeight + 0.5}px`;
            }
          }
        }
        lastScrollTop.current = currentScroll <= 0 ? 0 : currentScroll; // Cập nhật vị trí cuộn trước đó
      } else {
        console.error("Header or Header-Top element not found.");
      }
    };
    window.addEventListener("scroll", handleScroll);
    // Cleanup function to remove the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array to run only once when the component mounts
  // Phương thức để mở tìm kiếm
  const openSearch = () => {
    if (searchWrapRef.current) {
      searchWrapRef.current.style.display = "block";
    }
  };
  // Phương thức để đóng tìm kiếm
  const closeSearch = () => {
    if (searchWrapRef.current) {
      searchWrapRef.current.style.display = "none";
    }
  };
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmitSearch = () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("search", search);
    console.log(queryParams.toString());
    closeSearch();
    navigate(`/ListingGrid?${queryParams}`);
  };
  const handleKeyDown = (event) => {
    if (event.key == "Enter") {
      handleSubmitSearch();
    }
  };
  const { cartLength } = useCart();

  return (
    <section className="header" ref={headerRef}>
      <div className="header-top container-fluid md-0 " ref={headerTopRef}>
        <div className="row">
          <div className="col-4 py-1">
            <p className="">Shop Online  /<Link to={'/Shop/create'} className="mx-2" style={{ color:"white" }}>Kênh người bán</Link></p>
          </div>
          <div className="col-8 py-1 text-end">
            <p className="">Mua hàng Online: 0378746355</p>
          </div>
        </div>
      </div>
      <div className="header-bottom ">
        <div className="container">
          <div className="row">
            <div className=" col-md-3 col-6">
              <div className="logo">
                <Link className="navbar-brand" to={''} >
                  <img src={require("../assets/image/logo.png")} alt="aaaa" />
                </Link>
              </div>
            </div>
            <div className="col-xl-6 col-lg-7 d-none d-lg-flex menu">
              <div className="menu-pig">
                <nav className="navbar navbar-expand-md">
                  <div
                    className="collapse navbar-collapse "
                    id="collapsibleNavbar"
                  >
                    <Menu />
                  </div>
                </nav>
              </div>
            </div>
            <div className="col-xl-3 col-lg-2  col-md-9 col-6 icon-header">
              <ul>
                <li className="btn-menu-mobile" onclick="openMenu()">
                  <i className="fa-regular fa-list"></i>
                </li>
                <li className=" search ">
                  <div className="search-icon" onClick={openSearch}>
                    <a>
                      <i className="fa-light fa-magnifying-glass "></i>
                    </a>
                  </div>
                </li>
                <li className="account-customer ">
                  <div className="account-customer-icon">
                    <a>
                      <i className="fa-light fa-circle-user "></i>
                      <span>Tài Khoản</span>
                    </a>

                    <div className="account-login-register">
                      {localStorage.getItem("authToken") &&
                      localStorage.getItem("email") ? (
                        <>
                          <Link to="/Profile">Quản lý tài khoản</Link>
                          <Link to="/Logout">Đăng xuất</Link>
                        </>
                      ) : (
                        <>
                          <Link to="/Login">Đăng nhập</Link>
                          <Link to="/Register">Đăng ký</Link>
                        </>
                      )}
                      {/* <a href="/Login">Đăng nhập</a>
                      <a href="/">Đăng ký</a> */}
                    </div>
                  </div>
                </li>
                <li className=" shopping-cart">
                  <div className="shopping-cart-icon">
                    <Link to={"/Cart"}>
                      <strong className="icon">
                        <i className="fa-light fa-bag-shopping "></i>
                        <div className="notification-bubble" id="showqty">
                          {cartLength}
                        </div>
                      </strong>
                      <span>Giỏ hàng</span>
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* <form action="{{ route('site.product.search') }}" method="get"> */}
          <div className="search-wrap" ref={searchWrapRef}>
            <div className="container">
              <div className="search-mini ">
                <div className="input-group">
                  <input
                    type="text"
                    className=""
                    name="search"
                    style={{ outline: "none" }}
                    placeholder="Tìm kiếm"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon"
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="btn input-group-text"
                    type="submit"
                    id="basic-addon"
                    onClick={handleSubmitSearch}
                  >
                    {/* {{-- <i className="fa fa-search" ></i> --}} */}
                    <i className="fa-light fa-magnifying-glass"></i>
                  </button>
                  <span className="input-group-text " id="basic-addon">
                    <i className="fa-light fa-xmark" onClick={closeSearch}></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* </form> */}
        </div>
      </div>
      <script></script>
      {/* <x-mobile-menu /> */}
    </section>
  );
}
export default Header;
