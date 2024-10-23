import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GET_ID, PUT_EDIT } from "../../api/apiService";
import axios from "axios";
function InfoUser() {
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [buildingName, setBuildingName] = useState("");

  const [codeCity, setCodeCity] = useState(0);
  const [codeDistrict, setCodeDistrict] = useState(0);
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (!email) {
      navigate("/");
      toast.warning("Hãy đăng nhập để liên kết với tài khoản của bạn!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  }, []);
  useEffect(() => {
    if (email) {
      GET_ID("users/email", email)
        .then((response) => {
          setFirstName(response.firstName);
          setLastName(response.lastName);
          setMobileNumber(response.mobileNumber);
          setCity(response.address.city);
          setDistrict(response.address.district);
          setWard(response.address.ward);
          setBuildingName(response.address.buildingName);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Không thể lấy dữ liệu", {
            position: "top-center",
            autoClose: 2000,
          });
        });
    }
  }, []);
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/")
      .then((response) => {
        console.log(response);
        setCitys(response.data);
        response.data.map((item) => {
          if (item.name === city) {
            setCodeCity(item.code);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [city]);
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
          // setWard("");
          setWards([]);
          response.data.districts.map((item) => {
            if (item.name == district) {
              setCodeDistrict(item.code);
            }
          });
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
          // setWard("");
          setWards(response.data.wards);
          setDistrict(response.data.name);
          // response.data.wards.map((item) => {
          // });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setWard("");
      setWards([]);
    }
  }, [codeDistrict]);

  const handleUpdateInfo = () => {
    let data = {
      lastName: lastName,
      firstName: firstName,
      mobileNumber: mobileNumber,
      address: {
        city: city,
        district: district,
        ward: ward,
        buildingName: buildingName,
        country: "Việt Nam",
        pincode: "999999",
      },
    };

    if (email) {
      PUT_EDIT(`users/email/${email}`, data)
        .then((response) => {
          if (response) {
            toast.success("Cập nhật thông tin thành công", {
              position: "top-center",
              autoClose: 2000,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          toast.warning("Cập nhật thông tin không thành công", {
            position: "top-center",
            autoClose: 2000,
          });
        });
    }
  };

  const inputPhone = (e) => {
    const value = e.target.value;
    // Kiểm tra chỉ cho phép nhập số và tối đa 10-11 ký tự
    if (/^\d{0,11}$/.test(value)) {
      setMobileNumber(value);
    }
  };
  return (
    <div style={{ maxWidth: "650px" }}>
      <Row>
        <Col sm={6}>
          <label htmlFor="lastName">Họ: </label>
          <input
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="form-control mt-2"
          />
        </Col>
        <Col sm={6}>
          <label htmlFor="firstName">Tên: </label>
          <input
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-control mt-2"
          />
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <label htmlFor="email">Email: </label>
          <input
            name="email"
            value={email}
            className="form-control mt-2"
            disabled
          />
        </Col>
        <Col sm={6}>
          <label htmlFor="mobileNumber">Số điện thoại: </label>
          <input
            name="mobileNumber"
            value={mobileNumber}
            onChange={(e) => inputPhone(e)}
            maxLength={10}
            className="form-control mt-2"
          />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
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
        </Col>
        <Col md={4}>
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
        </Col>
        <Col md={4}>
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
        </Col>
      </Row>
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
      <div>
        <button
          className="btn form-control"
          style={{
            maxWidth: "150px",
            backgroundColor: "rgb(200, 200, 200)",
            color: "white",
          }}
          onClick={handleUpdateInfo}
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}

export default InfoUser;
