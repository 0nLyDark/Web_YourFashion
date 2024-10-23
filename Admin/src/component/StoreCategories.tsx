import { useEffect } from "react";
import {
  BooleanField,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  List,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";
import { useNavigate, useParams } from "react-router-dom";

export const StoreCategoryList = () => {
  const { id } = useParams();
  localStorage.setItem("storeId", id + "");
  return (
    <List resource="storeCategories">
      <h4>Danh sách danh mục của cửa hàng</h4>
      <Datagrid rowClick="show">
        <TextField source="categoryId" label="Category ID" />
        <TextField source="categoryName" label="Category Name" />
        <BooleanField
          source="status"
          valueLabelTrue="Hiện"
          valueLabelFalse="Ẩn"
          label="Trạng thái"
        />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
export const StoreCategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="categoryId" label="Category ID" disabled />
      <TextInput source="categoryName" label="Category Name" />
      <SelectInput
        source="status"
        choices={[
          { id: true, name: "Hiện" },
          { id: false, name: "Ẩn" },
        ]}
      />
    </SimpleForm>
  </Edit>
);
export const StoreCategoryStore = () => {
  const navigate = useNavigate();
  const storeId = localStorage.getItem("storeId");
  useEffect(() => {
    navigate(`/stores/${storeId}/show`);
  }, []);
  return <>Test</>;
};
