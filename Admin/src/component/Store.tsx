import {
  Datagrid,
  DateField,
  DeleteButton,
  Edit,
  EditButton,
  EmailField,
  FunctionField,
  Link,
  List,
  ListProps,
  NumberField,
  Pagination,
  PaginationProps,
  Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  useRecordContext,
} from "react-admin";
import { Box, Button, Card, CardContent } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { StoreCategoryList } from "./StoreCategories";
import { ProductList } from "./Product";
import { useState } from "react";

const CustomImageField = ({ source }: { source: string }) => {
  const record = useRecordContext();
  if (!record || !record[source]) {
    return <span>No Image</span>;
  }

  return (
    <Link to={`/stores/${record.id}/update-image`} prefix="">
      <img
        src={record[source]}
        alt="Product"
        style={{ width: "100px", height: "auto" }}
      />
      {/* <img src={"record[source]" } alt="Product" style={{ width: '100px', height: 'auto' }} /> */}
    </Link>
  );
};
export const StoreList = () => (
  <List>
    <Datagrid rowClick={false}>
      <TextField source="id" label="Mã cửa hàng" />
      <TextField source="storeName" label="Tên cửa hàng" />
      <CustomImageField source="logo" />
      <EmailField source="email" label="Email" />
      <TextField source="mobileNumberStore" label="Số điện thoại" />
      <DateField source="createdAt" label="Ngày tạo" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
export const StoreEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" label="Mã cửa hàng" disabled />
      <TextInput source="storeName" label="Tên cửa hàng" />
      <TextInput source="logo" disabled />
      <TextInput source="email" label="Email" />
      <TextInput source="mobileNumberStore" label="Số điện thoại" />
      <TextInput source="address.ward" label="ward" />
      <TextInput source="address.buildingName" label="buildingName" />
      <TextInput source="address.city" label="city" />
      <TextInput source="address.district" label="district" />
      <TextInput source="address.country" label="country" />
      <TextInput source="address.pincode" label="pincode" />
      <TextInput source="createdAt" label="Ngày tạo" disabled />
    </SimpleForm>
  </Edit>
);
export const StoreShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const changePageToProducts = () => {
    navigate(`/stores/${id}/products`);
  };
  return (
    <Show>
      <SimpleShowLayout>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <div className="show-store">
            <div className="box">
              <label>Mã cửa hàng: </label>
              <TextField source="id" />
            </div>
            <div className="box">asdas</div>
            <div className="box">
              <label>Tên cửa hàng: </label>
              <TextField source="storeName" />
            </div>
            <div className="box">
              <label>Email cửa hàng: </label>
              <TextField source="email" />
            </div>
            <div className="box">
              <label>SĐT cửa hàng: </label>
              <TextField source="mobileNumberStore" />
            </div>
            <div className="box">
              <label>Ngày tạo cửa hàng: </label>
              <DateField source="createdAt" />
            </div>
            <div className="box">
              <label>Địa chỉ: </label>
              <TextField source="address.buildingName" />,{" "}
              <TextField source="address.ward" />,{" "}
              <TextField source="address.district" />,{" "}
              <TextField source="address.city" />,{" "}
              <TextField source="address.country" />
            </div>
            <div className="box">
              <Button onClick={changePageToProducts}>Xem sản phẩm</Button>
            </div>
          </div>
        </div>
        <Card>
          <StoreCategoryList />
        </Card>
      </SimpleShowLayout>
    </Show>
  );
};

export const CustomProductByStore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const changePageToProducts = () => {
    navigate(`/stores/${id}/show`);
  };
  return (
    <Card style={{ padding: "20px" }}>
      <Button onClick={changePageToProducts}>Quay lại cửa hàng</Button>
      <List resource="products" queryOptions={{ meta: { storeId: id } }}>
        <Datagrid>
          <TextField source="productId" label="Product ID" />
          <TextField source="productName" label="Product Name" />
          <TextField source="category.categoryName" label="Category Name" />
          <CustomImageField source="image" />
          <NumberField source="quantity" label="Quantity" />
          <NumberField source="price" label="Price" />
          <NumberField source="discount" label="Discount" />
          <NumberField source="specialPrice" label="Special Price" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      </List>
    </Card>
  );
};
