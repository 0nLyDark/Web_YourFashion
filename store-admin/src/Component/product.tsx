import {
  List,
  useRecordContext,
  Datagrid,
  TextField,
  NumberField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  EditButton,
  DeleteButton,
  FunctionField,
} from "react-admin";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export const CustomImageField = ({ source }: { source: string }) => {
  const record = useRecordContext();
  if (!record || !record[source]) {
    return <span>No Image</span>;
  }

  return (
    <RouterLink to={`/products/${record.id}/update-image`} prefix="">
      <img
        src={record[source]}
        alt="Product"
        style={{ width: "100px", height: "auto" }}
      />
      {/* <img src={"record[source]" } alt="Product" style={{ width: '100px', height: 'auto' }} /> */}
    </RouterLink>
  );
};
const postFilters = [
  <TextInput source="search" label="Search" alwaysOn />,
  <ReferenceInput source="categoryId" reference="categories" label="Category">
    <SelectInput optionText="categoryName" />
  </ReferenceInput>,
];
export const truncate = (str: string, maxLength: number | 0) => {
  // Kiểm tra nếu str là null hoặc undefined, hoặc không phải là chuỗi
  if (typeof str !== "string") {
    return ""; // Trả về chuỗi rỗng hoặc xử lý phù hợp
  }

  // Thực hiện cắt ngắn chuỗi
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};
export const ProductList = () => (
  <List filters={postFilters}>
    <Datagrid rowClick={false}>
      <TextField source="productId" label="Product ID" />
      <TextField source="productName" label="Product Name" />
      <TextField source="category.categoryName" label="Ngành hàng" />
      <CustomImageField source="image" />
      <FunctionField
        source="description"
        label="Description"
        render={(record) => truncate(record.description, 25)}
      />
      <NumberField source="quantity" label="Quantity" />
      <NumberField source="price" label="Price" />
      <NumberField source="discount" label="Discount" />
      <NumberField source="specialPrice" label="Special Price" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
export const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput
        source="productName"
        label="Product Name (Product name must contain atleast 3 characters)"
      />
      <TextInput
        source="description"
        label="Description (Product Description must contain atleast 6 characters)"
        multiline
      />
      <NumberInput source="quantity" label="Quantity" />
      <NumberInput source="price" label="Price" />
      <NumberInput source="discount" label="Discount" />
      <NumberInput source="specialPrice" label="Special Price" />
      <ReferenceInput
        source="categoryId"
        reference="categories"
        label="Category"
      >
        <SelectInput optionText="categoryName" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
const ReferenceInputCustom = () => {
  const record = useRecordContext();
  useEffect(() => {
    console.log("aaaa", record);
  }, []);
  return (
    <ReferenceInput source="categoryId" reference="categories">
      <SelectInput
        optionText="categoryName"
        defaultValue={record?.category.categoryId}
        label="Ngành hàng"
      />
    </ReferenceInput>
  );
};
export const ProductEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="productId" disabled />
        <ReferenceInputCustom />
        <TextInput source="productName" />
        <TextInput source="image" disabled />
        <TextInput source="description" multiline />
        <NumberInput source="quantity" />
        <NumberInput source="price" />
        <NumberInput source="discount" />
        <NumberInput source="specialPrice" />
      </SimpleForm>
    </Edit>
  );
};
