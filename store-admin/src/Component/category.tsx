import { useEffect, useState } from "react";
import {
  List,
  Datagrid,
  TextField,
  DeleteButton,
  EditButton,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  Button,
  useListContext,
  useRefresh,
  BooleanField,
  LoadingPage,
  ListContextProvider,
  useListController,
  Title,
  useGetList,
  ImageField,
  CheckboxGroupInput,
  ArrayField,
  NumberField,
} from "react-admin";
import {
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { useLocation, useParams } from "react-router-dom";
import { CustomImageField, truncate } from "./product";
import { apiUrl, httpClient } from "../dataProvider";

export const CategoryList = () => (
  <List>
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

export const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="categoryName" label="Category Name" />
    </SimpleForm>
  </Create>
);
const ListActions = () => (
  <div>
    <Button label="Thêm Sản Phẩm" />
    {/* <ExportButton /> */}
  </div>
);

const CustomBulkActionButtons = () => {
  const refresh = useRefresh();
  const { id } = useParams();
  const email = localStorage.getItem("username");
  const { selectedIds } = useListContext();
  const [page, setPage] = useState(1);
  const perPage = 10;
  // const {setSelectedIds} = useListContext();
  const handleCustomDelete = async () => {
    // Tùy chỉnh hành động xóa ở đây
    const url = `${apiUrl}/seller/stores/email/${email}/categories/${id}/products`;
    await httpClient.delete(url, {
      data: {
        ids: selectedIds, // Sending the ID as part of the request body, if needed
      },
    });
    refresh();
  };

  return (
    <div>
      <Button
        label="Delete"
        onClick={handleCustomDelete}
        style={{ color: "red", fontSize: "16px", fontStyle: "blod" }}
      />
    </div>
  );
};

export const CategoryShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="categoryName" label="Category Name" />
        {/* <List resource="products" actions={<ListActions />}> */}
        <CustomListData />
      </SimpleShowLayout>
    </Show>
  );
};

const CustomListData = () => {
  const { id } = useParams();
  const email = localStorage.getItem("username");
  const refresh = useRefresh();
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const sort = { field: "id", order: "ASC" };
  const { data, total, isPending } = useGetList("products", {
    filter: { storeCategoryId: id },
    pagination: { page, perPage },
    sort: { field: "id", order: "ASC" },
  });
  if (isPending) {
    return <div>Loading...</div>;
  }
  const removeProductFromCategory = async (productId: any) => {
    const url = `${apiUrl}/seller/stores/categories/${id}/products/${productId}`;
    await httpClient.delete(url, {
      data: {
        ids: [id], // Sending the ID as part of the request body, if needed
      },
    });
    refresh();
  };
  return (
    <Card>
      <Title title="Chi tiết danh mục" />
      <Card>
        <Card style={{ marginBottom: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 10px",
            }}
          >
            <strong>Danh sách sản phẩm</strong>
            <CustomAddProductFromCategory />
          </div>
        </Card>
        <Table sx={{ padding: 2 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>ProductName</TableCell>
              <TableCell style={{ textAlign: "center" }}>Hình</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Tồn kho</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((pro) => (
                <TableRow key={pro.id}>
                  <TableCell>{pro.id}</TableCell>
                  <TableCell>{pro.productName}</TableCell>
                  <TableCell>
                    <ImageField source="image" record={pro} />
                  </TableCell>
                  <TableCell>{pro.price}</TableCell>
                  <TableCell>{pro.quantity}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        removeProductFromCategory(pro.id);
                      }}
                      label="DELETE"
                      style={{ color: "red" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </Card>
  );
};
const CustomAddProductFromCategory = () => {
  const { id } = useParams();
  const email = localStorage.getItem("username");
  const refresh = useRefresh();
  const [page, setPage] = useState(1);
  const perPage = 10;
  const { data, total, isPending } = useGetList("products", {
    pagination: { page, perPage },
    sort: { field: "id", order: "ASC" },
  });
  const [open, setOpen] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [check, setCheck] = useState<number[]>([]);
  const handleProductSelect = (productId: number) => {
    setCheck((prevCheck) => {
      if (prevCheck.includes(productId)) {
        return prevCheck.filter((id) => id !== productId);
      } else {
        return [...prevCheck, productId];
      }
    });
  };
  const handleAddProduct = async () => {
    const url = `${apiUrl}/seller/stores/categories/${id}/products`;
    await httpClient.post(url, check);
    setOpen(false);
    setCheck([]);
    refresh();
  };
  return (
    <div>
      <Button
        label="Thêm sản phẩm"
        onClick={() => {
          setOpen(true);
        }}
      />
      {open && (
        <div id="productModal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Chọn Sản Phẩm</h2>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                &times;
              </span>
            </div>

            <div className="modal-body">
              <div className="filter">
                <select>
                  <option>Ngành hàng</option>
                </select>
                <select>
                  <option>Thương hiệu</option>
                </select>
                <input type="text" placeholder="Tìm tên sản phẩm" />
                <input type="number" placeholder="Giá từ" />
                <input type="number" placeholder="Giá đến" />
              </div>

              <Table sx={{ padding: 2 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>Id</TableCell>
                    <TableCell>ProductName</TableCell>
                    <TableCell style={{ textAlign: "center" }}>Hình</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Tồn kho</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    data.map((pro) => (
                      <TableRow key={pro.id}>
                        <TableCell>
                          <Checkbox
                            onChange={() => {
                              handleProductSelect(pro.id);
                            }}
                          />
                        </TableCell>
                        <TableCell>{pro.id}</TableCell>
                        <TableCell>{pro.productName}</TableCell>
                        <TableCell>
                          <ImageField source="image" record={pro} />
                        </TableCell>
                        <TableCell>{pro.price}</TableCell>
                        <TableCell>{pro.quantity}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <div className="modal-footer">
              <button
                className="button cancel"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                Hủy
              </button>
              <button className="button" onClick={handleAddProduct}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CategoryEdit = () => (
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
