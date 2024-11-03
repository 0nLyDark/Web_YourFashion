import { useNavigate } from "react-router-dom";
import { GET_ID, POST_ADD } from "../api/apiService";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const ShopCreate = () => {
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  GET_ID(`stores/email`, email)
    .then((response) => {
      window.open("http://localhost:5173/", "_blank");
      navigate("/");
    })
    .catch((erorr) => {});

  const [storeName, setStoreName] = useState("");
  const [mobieNumber, setMobieNumber] = useState("");

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
      setMobieNumber(value);
    }
  };

  const registerStores = () => {
    let data = {
      storeName: storeName,
      email: email,
      mobileNumberStore: mobieNumber,
      address: {
        ward: ward,
        buildingName: buildingName,
        city: city,
        district: district,
        country: "Việt Nam",
        pincode: "999999",
      },
    };
    POST_ADD("stores", data)
      .then((response) => {
        window.open("http://localhost:5173/", "_blank");
        navigate("/");
      })
      .catch((erorr) => {
        console.log(erorr);
        toast.error("Tạo cửa hàng thất bại", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };
  return (
    <div style={{ width: "100vw", height: "100vh", padding: "auto" }}>
      <div className="from-createShop">
        <h3 className="text-center">Bạn chưa có cửa hàng?</h3>
        <h4 className="text-center"> Hãy đăng ký cửa hàng của bạn</h4>
        <div className="infoText">
          <div>
            <label>Tên cửa hàng:</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Nhập tên cửa hàng"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="text"
              value={email}
              className="form-control"
              disabled
            />
          </div>
          <div>
            <label>Số điện thoại:</label>
            <input
              type="text"
              value={mobieNumber}
              onChange={(e) => inputPhone(e)}
              className="form-control"
              maxlength="10"
              placeholder="Nhập điện thoại"
            />
          </div>
          <div style={{ width: "100%" }}>
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
          <div style={{ width: "100%", textAlign: "center" }}>
            <button
              onClick={registerStores}
              className="btn btn-info form-control text-white w-50"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;
