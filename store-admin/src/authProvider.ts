import { redirect, useNavigate } from "react-router-dom";
import { AuthProvider, useRedirect } from "react-admin";
import axios from "axios";
interface LoginParams {
  username: string;
  password: string;
}
interface CheckParamsErr {
  status: number;
}
export const authProvider = {
  // called when the user attempts to log in
  login: async ({ username, password }: LoginParams) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        {
          email: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Store the JWT token in local storage
      const token = response.data["jwt-token"];
      localStorage.setItem("jwt-token", token);
      localStorage.setItem("username", username);
      // Fetch user data to get stoeId
      const userResponse = await axios.get(
        `http://localhost:8080/api/public/stores/email/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const storeId = userResponse.data.id;
      localStorage.setItem("storeId", storeId);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(
        new Error("Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.")
      );
      // return Promise.reject(error);
    }
  },

  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("username");
    localStorage.removeItem("storeId");

    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }: CheckParamsErr) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("jwt-token");
      localStorage.removeItem("username");
      localStorage.removeItem("storeId");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem("jwt-token")
      ? Promise.resolve()
      : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
};
