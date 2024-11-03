import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import Main from "./layouts/Main";
import "./assets/sass/app.scss";
import { BrowserRouter, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
// import "./assets/js/style";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";

function App() {
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
          <Layouts />
        </BrowserRouter>
      </CartProvider>
    </PayPalScriptProvider>
  );
}

export default App;

const Layouts = () => {
  const location = useLocation();
  const [hidenLayout, setHidenLayout] = useState(false);
  useEffect(() => {
    console.log("aaaaaaaaasssssssss", location.pathname);
    if (location.pathname == "/Shop/create") {
      setHidenLayout(true);
    } else {
      setHidenLayout(false);
    }
  }, [location]);
  return (
    <div>
      {!hidenLayout && <Header />}
      <div style={{ minHeight: "500px" }}>
        <Main />
      </div>
      {!hidenLayout && <Footer />}
    </div>
  );
};
