import {
  Admin,
  CustomRoutes,
  Resource,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { Dashboard } from "./Dashboard";
import { ProductCreate, ProductEdit, ProductList } from "./Component/product";
import { CategoryCreate, CategoryEdit, CategoryList, CategoryShow } from "./Component/category";
import { Route } from "react-router-dom";
import ProductImageUpdate from "./Component/ProductImageUpdate";
import { StoreCreate, StoreInfo } from "./Component/store";
import { OrderEdit, OrderList } from "./Component/order";

export const App = () => (
  <Admin authProvider={authProvider} layout={Layout} dataProvider={dataProvider} dashboard={Dashboard}>
    <CustomRoutes>
        <Route path="/products/:id/update-image" element={<ProductImageUpdate />} />
        <Route path="/stores/create" element={<StoreCreate />} />
    </CustomRoutes>
    <Resource name="stores" list={StoreInfo}  options={{ label: 'Hồ sơ cửa hàng' }} />

    <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit} options={{ label: 'Sản phẩm' }} />
    <Resource name="storeCategories" options={{ label: 'Danh Mục' }} list={CategoryList} create={CategoryCreate} show={CategoryShow} edit={CategoryEdit}  />
    <Resource name="orders" list={OrderList}  edit={OrderEdit}  />

  </Admin>
);
