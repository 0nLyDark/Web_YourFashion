import React, { useState } from "react";
import { LOGIN, Register } from "../../api/apiService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import "../../assets/css/style-register.css";
const SectionContent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobieNumber] = useState("");

  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const body = {
      userId: 0,
      firstName: firstName,
      lastName: lastName,
      mobileNumber: mobileNumber,
      email: email,
      password: password,
      roles: [
        {
          roleId: 102,
          roleName: "USER",
        },
      ],
      address: {
        addressId: 0,
        ward: "strifang",
        buildingName: "fasfasfsa",
        city: city,
        district: "string",
        country: country,
        pincode: "999999",
      },
    };
    try {
      const response = await Register(body);
      if (response && response.data) {
        const token = response.data["jwt-token"];
        if (token) {
          window.alert("Register successful!");
          navigate("/Login"); // Redirect to the homepage using navigate
        } else {
          window.alert("Token not found in response");
        }
      } else {
        window.alert("Register response is missing data");
      }
    } catch (error) {
      window.alert("Register failed: " + error.message);
    }
  };

  return (
    <div
      className="card mx-auto"
      style={{ maxWidth: "520px", marginTop: "40px" }}
    >
      <article className="card-body">
        <header className="mb-4">
          <h4 className="card-title">Sign up</h4>
        </header>
        <div className="form-row">
          <div className="col form-group">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="col form-group">
            <label>Last name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <small className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            className="form-control"
            name="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobieNumber(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6 pe-2">
            <label>City</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="form-group col-md-6 ps-2">
            <label>Country</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6 pe-2">
            <label>Create password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* <div className="form-group col-md-6 ps-2">
              <label>Repeat password</label>
              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div> */}
        </div>
        <div className="form-group">
          <button
            className="btn btn-primary btn-block"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </article>
      <p className="text-center mt-4">
        Have an account? <Link to={`/Login`}>Log In</Link>
      </p>
    </div>
  );
};

export default SectionContent;
