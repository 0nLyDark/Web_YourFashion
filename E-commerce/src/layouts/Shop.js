import React, { useState } from "react";
import ProductStore from "../page/Product/productStore";
import InfoShop from "../page/Shop/infoShop";
import ProductList from "../page/Shop/productList";

function Shop(){
    const [loading, setLoading] = useState(true);
    const [store, setStore] = useState({});
    

    return(
        <div className="container ">
            <InfoShop />
            <ProductList />

        </div>
    )
}

export default Shop;