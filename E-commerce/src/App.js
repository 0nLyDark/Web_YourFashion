import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Main from "./layouts/Main";
import "./assets/sass/app.scss";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
// import "./assets/js/style";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  console.log("iddddddddddd", process.env.REACT_APP_PAYPAL_CLIENT_ID);
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AQMi2YDClMa4Vpjj9BE0QbW9uKAA53OqpLopVcX2j9Vhre_18QhpeWQLQqxtwNi2TXXMT1OBqz8Ls8Nq",
        // currency: "VND",
        // buyerCountry: "VN",
      }}
    >
      <CartProvider>
        <BrowserRouter>
          <ToastContainer />
          <Header />
          <div style={{ minHeight: "500px" }}>
            <Main />
          </div>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </PayPalScriptProvider>
  );
}

export default App;
