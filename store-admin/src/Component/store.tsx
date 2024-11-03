import { Card } from "@mui/material";
import axios from "axios";
import { error } from "console";
import { useEffect, useState } from "react";
import { Button, TextField, useNotify } from "react-admin";

interface City {
  id: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  latitude: string;
  longitude: string;
}

export const StoreCreate = () => {
  return (
    <div>
      <Card>
        <h4>Bạn chưa có cửa hàng</h4>
        <h4>Hãy đăng ký cửa hàng của bạn</h4>
      </Card>
    </div>
  );
};

export const StoreInfo = () => {
  const [storeName, setStoreName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [logo, setLogo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const notify = useNotify();
  //Address
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [buildingName, setBuildingName] = useState("");

  const [codeCity, setCodeCity] = useState("");
  const [codeDistrict, setCodeDistrict] = useState("");
  const [citys, setCitys] = useState<City[]>([]);
  const [districts, setDistricts] = useState<City[]>([]);
  const [wards, setWards] = useState<City[]>([]);
  ////////////
  const email = localStorage.getItem("username");
  const storeId = localStorage.getItem("storeId");
  const token = localStorage.getItem("jwt-token");
  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => {
        console.log(response);
        setCitys(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    if (codeCity != "") {
      axios
        .get(`https://esgoo.net/api-tinhthanh/2/${codeCity}.htm`)
        .then((response) => {
          console.log(response);
          setCodeDistrict("");
          setDistrict("");
          setDistricts(response.data.data);
          citys.forEach((ct) => {
            if (ct.id == codeCity) {
              setCity(ct.full_name);
            }
          });
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
    if (codeDistrict != "") {
      axios
        .get(` https://esgoo.net/api-tinhthanh/3/${codeDistrict}.htm`)
        .then((response) => {
          console.log(response);
          setWard("");
          setWards(response.data.data);
          districts.forEach((dt) => {
            if (dt.id == codeDistrict) {
              setDistrict(dt.full_name);
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setWard("");
      setWards([]);
    }
  }, [codeDistrict]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/public/stores/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStoreName(response.data.storeName);
        setMobileNumber(response.data.mobileNumberStore);
        setLogo(response.data.logo);
        setCreatedAt(response.data.createdAt);
        setCity(response.data.address.city);
        setDistrict(response.data.address.district);
        setWard(response.data.address.ward);
        setBuildingName(response.data.address.buildingName);

        citys.forEach((ct) => {
          if (ct.full_name == response.data.address.city) {
            setCodeCity(ct.id);
          }
        });
        districts.forEach((dt) => {
          if (dt.full_name == response.data.address.districts) {
            setCodeCity(dt.id);
          }
        });
        setWard(response.data.address.ward);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const inputPhone = (e: any) => {
    const value = e.target.value;
    // Kiểm tra chỉ cho phép nhập số và tối đa 10-11 ký tự
    if (/^\d{0,11}$/.test(value)) {
      setMobileNumber(value);
    }
  };
  const handleUpadate = () => {
    let data = {
      storeName: storeName,
      mobileNumberStore: mobileNumber,
      address: {
        city: city,
        district: district,
        ward: ward,
        buildingName: buildingName,
        country: "Việt Nam",
        pincode: "999999",
      },
    };
    axios
      .put(`http://localhost:8080/api/seller/stores/${storeId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert("Cập nhật thành công");
      })
      .catch((error) => {
        console.log(error);
        alert("cập nhật thất bại, thông tin ko hợp lệ");
      });
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    axios
      .put(
        `http://localhost:8080/api/seller/stores/${storeId}/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setLogo(response.data.logo);
        notify("Image updated successfully.");
      })
      .catch((error) => {
        notify("Error updating image. ");
        console.error(error);
      });
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      // setPreview(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <Card style={{ padding: "60px", height: "100%" }}>
      <Card style={{ padding: "20px 80px 60px 80px" }}>
        <h4 style={{ textAlign: "center", fontSize: "20px" }}>
          Thông tin cửa hàng
        </h4>
        <div>
          <table className="info-shop">
            <tbody>
              <tr>
                <td>Logo: </td>
                <td colSpan={3}>
                  <div className="image-preview">
                    <label htmlFor="file-input">
                      <img
                        id="preview"
                        src={`http://localhost:8080/api/public/stores/image/${logo}`}
                        alt={`Click to choose image ${logo}`}
                        style={{ width: "100px", height: "100px" }}
                      />
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>Tên Shop: </td>
                <td>
                  <input
                    className="from-input"
                    value={storeName}
                    type="text"
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </td>
                <td>Số điện thoại:</td>
                <td>
                  <input
                    className="from-input"
                    value={mobileNumber}
                    type="text"
                    maxLength={10}
                    onChange={(e) => inputPhone(e)}
                  />
                </td>
              </tr>
              <tr>
                <td>Email: </td>
                <td>
                  <input
                    className="from-input"
                    value={email ?? ""}
                    type="text"
                    disabled
                  />
                </td>
                <td>Ngày tạo Store:</td>
                <td>{createdAt}</td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <label>Tỉnh / thành:</label>
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
                          <option value={city.id}>{city.full_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Quận / huyện:</label>
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
                          <option value={district.id}>
                            {district.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Phường / xã:</label>
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
                          <option value={ward.full_name}>
                            {ward.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Địa chỉ: </td>
                <td>
                  <input
                    className="from-input"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    type="text"
                  />
                </td>
                <td colSpan={2}>
                  {ward} / {district} / {city}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ textAlign: "end" }}>
            <Button label="Cập nhật" onClick={handleUpadate} />
          </div>
        </div>
      </Card>
    </Card>
  );
};
