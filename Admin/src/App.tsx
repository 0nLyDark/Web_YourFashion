import "./component/css/style.css";
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
  CustomRoutes,
} from "react-admin";
import { Route } from "react-router-dom";
import { Layout } from "./Layout";
import CategoryIcon from '@mui/icons-material/Category' ;
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OrderIcon from '@mui/icons-material/ListAlt';

import { dataProvider } from "./dataProvider";
import { Dashboard } from "./Dashboard";
import { authProvider } from "./authProvider";
import { CategoryList, CategoryCreate, CategoryEdit } from "./component/Category";
import {  ProductEdit, ProductList } from "./component/Product";
import ProductImageUpdate from "./component/ProductImageUpdate";
import { UserCreate, UserEdit, UserList } from "./component/User";
import { CartList, CartShow } from "./component/Cart";
import { OrderEdit, OrderList } from "./component/Order";
import { CustomProductByStore, StoreEdit, StoreList, StoreShow } from "./component/Store";
import StoreLogoUpdate from "./component/StoreLogoUpdate";
import { StoreCategoryEdit, StoreCategoryStore } from "./component/StoreCategories";

export const App = () => (
  <Admin authProvider={authProvider} layout={Layout} dataProvider={dataProvider} dashboard={Dashboard}>
    <CustomRoutes>
        <Route path="/products/:id/update-image" element={<ProductImageUpdate />} />
        <Route path="/stores/:id/update-image" element={<StoreLogoUpdate />} />
        <Route path="/stores/:id/products" element={<CustomProductByStore />} />

    </CustomRoutes>
    <Resource name="categories" list={CategoryList} create={CategoryCreate} edit={CategoryEdit} icon={CategoryIcon} />
    <Resource name="products" list={ProductList}  edit={ProductEdit} icon={Inventory2Icon} />
    <Resource name="carts" list={CartList} show={CartShow} icon={ShoppingCartIcon} />
    <Resource name="orders" list={OrderList}  edit={OrderEdit} icon={OrderIcon} />
    <Resource name="stores" list={StoreList} edit={StoreEdit} show={StoreShow}  icon={OrderIcon} />
    <Resource name="storeCategories" edit={StoreCategoryEdit}  icon={OrderIcon} />

    <Resource name="users" list={UserList} create={UserCreate}  edit={UserEdit} icon={AccountCircleIcon} />

  </Admin>

);
