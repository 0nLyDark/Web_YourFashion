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
import { ProductCreate, ProductEdit, ProductList } from "./component/Product";
import ProductImageUpdate from "./component/ProductImageUpdate";
import { UserCreate, UserEdit, UserList } from "./component/User";
import { CartList, CartShow } from "./component/Cart";
import { OrderEdit, OrderList } from "./component/Order";

export const App = () => (
  <Admin authProvider={authProvider} layout={Layout} dataProvider={dataProvider} dashboard={Dashboard}>
    <CustomRoutes>
        <Route path="/products/:id/update-image" element={<ProductImageUpdate />} />
        
    </CustomRoutes>
    <Resource name="categories" list={CategoryList} create={CategoryCreate} edit={CategoryEdit} icon={CategoryIcon} />
    <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit} icon={Inventory2Icon} />
    <Resource name="carts" list={CartList} show={CartShow} icon={ShoppingCartIcon} />
    <Resource name="orders" list={OrderList}  edit={OrderEdit} icon={OrderIcon} />

    <Resource name="users" list={UserList} create={UserCreate}  edit={UserEdit} icon={AccountCircleIcon} />

  </Admin>

);
