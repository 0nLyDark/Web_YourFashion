import axios from "axios";
import { useEffect, useState } from "react";
import {
  List,
  useRecordContext,
  ReferenceField,
  TextField,
  Show,
  SimpleShowLayout,
  NumberField,
  ArrayField,
  ImageField,
  Datagrid,
  useRedirect,
  useDataProvider,
  useNotify,
  DateField,
  useRefresh,
} from "react-admin";
import { useParams, useLocation } from "react-router-dom";
import PDFButton from "../PDFButton";

const CustomPDFButton = () => {
  const record = useRecordContext();
  if (!record) {
    return <span>Loading ...</span>;
  }

  if (!record.id) {
    return <span>No cart ID</span>;
  }
  console.log("record", record);

  return (
    <PDFButton
      id={String(record.id)}
      email={String(record.email)}
      source="orders"
    />
  );
};

export const OrderList = () => {
  const handleRowClick = (id: any, resource: any, record: any) => {
    // Thực hiện hành động tùy chỉnh khi nhấp chuột vào hàng
    // Trả về đường dẫn để điều hướng hoặc false để không thực hiện hành động nào
    const path = `/orders/${id}/edit?email=${record.email}`;
    return path; // Trả về đường dẫn để điều hướng
  };
  return (
    <List>
      <Datagrid rowClick={handleRowClick}>
        <TextField source="orderId" label="Order ID" />
        <TextField source="email" label="Email " />
        <DateField source="orderDate" label="Order Date " />
        <TextField source="payment.paymentMethod" label="Payment Method" />
        <NumberField source="totalAmount" label="Total Amount" />
        <TextField source="orderStatus" label="Order Status" />
      </Datagrid>
    </List>
  );
};

const CustomFrom = (data: any) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("jwt-token");
  const handleUpload = async () => {
    try {
      console.log(data.id);
      await axios.put(
        `http://localhost:8080/api/seller/users/${data.email}/orders/${parseInt(
          data.id
        )}/orderStatus/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      notify("Order Status updated successfully.");
      redirect("/orders");
    } catch (error) {
      notify("Error updating order status.");
      console.error(error);
    }
  };
  return (
    <div>
      <form>
        <label>Update Status: </label>
        <input
          type="text"
          onChange={(e) => {
            setStatus(e.target.value);
          }}
        />
        <button onClick={handleUpload}>Save</button>
      </form>
    </div>
  );
};

export const OrderEdit = () => {
  const location = useLocation();
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get("email");
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  // useEffect(() => {
  //     const fetchCart = async () => {
  //         const queryParams = new URLSearchParams(location.search);
  //         const emailParam = queryParams.get('email');

  //         if (emailParam && emailParam !== email) {
  //             setEmail(emailParam);
  //             try {
  //                 const { data } = await dataProvider.getOne('orders', { id, meta: { email: emailParam } });
  //                 setOrder(data);
  //                 setStatus(data.orderStatus);
  //             } catch (error) {
  //                 console.error("Error fetching cart data:", error);
  //                 notify('Error fetching cart data');
  //                 redirect('/orders')
  //             }
  //         }
  //     };
  //     fetchCart();
  // }, [id,email]);
  const onError = (error: { message: any }) => {
    notify(`Could not load cart: ${error.message}`, { type: "error" });
    redirect("/carts");
    refresh();
  };

  if (!emailParam) {
    return <span>Error: Email is required</span>;
  }
  return (
    <Show
      queryOptions={{
        meta: { email: emailParam },
        onError,
      }}
    >
      <SimpleShowLayout>
        <CustomPDFButton />
        <TextField source="id" label="Order ID:" />
        <TextField source="email" label="Email:" />
        <TextField source="deliveryName" label="DeliveryName:" />
        <TextField source="deliveryPhone" label="DeliveryPhone:" />
        <TextField source="address" label="Address:" />
        <DateField source="orderDate" label="Order Date:" />
        <NumberField source="totalAmount" label="Total Amount:" />
        <TextField source="payment.paymentMethod" label="Payment Method:" />
        <TextField source="payment.paymentCode" label="Payment Code:" />

        <TextField source="orderStatus" label="Order Status:" />
        <CustomFrom id={id} email={emailParam} />
        <ArrayField source="orderItems" label="Order Items:">
          <ImageField source="image" label="Image" />
          <Datagrid rowClick={false}>
            <TextField source="id" label="Order Item ID" />
            <TextField source="productName" label="Product Name" />
            <ImageField source="image" label="Image" />
            <NumberField
              source="orderedProductPrice"
              label="Ordered Product Price"
            />
            <NumberField source="quantity" label="Quantity" />
            <NumberField source="discount" label="Discount" />
            <TextField source="category.name" label="Category" />
          </Datagrid>
        </ArrayField>
      </SimpleShowLayout>
    </Show>
  );
};
