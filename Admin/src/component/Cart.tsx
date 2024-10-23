import { List, useRecordContext, ReferenceField, TextField, Show, SimpleShowLayout, NumberField, ArrayField, ImageField,
    Datagrid, useRedirect ,
    useDataProvider,
    useNotify,
    useRefresh} from 'react-admin';
import { useParams, useLocation } from 'react-router-dom';

import PDFButton from '../PDFButton';
    const CustomPDFButton = () => {
        const record = useRecordContext();
        if (!record) {
            return <span>Loading ...</span>;
        }
        
        if (!record.id) {
            return <span>No cart ID</span>;
        }
        console.log("record",record);

        return <PDFButton id={String(record.id)} email={String(record.email)} source='carts' />;
    };

    
    export const CartList = () => {
        const redirect = useRecordContext()
        const handleRowClick = (id: any, resource: any, record: any) => {
            // Thực hiện hành động tùy chỉnh khi nhấp chuột vào hàng
            // Trả về đường dẫn để điều hướng hoặc false để không thực hiện hành động nào
            const path = `/carts/${id}/show?email=${record.email}`;
            return path; // Trả về đường dẫn để điều hướng
        };
        return (
            <List >
                <Datagrid rowClick={handleRowClick}>
                    <TextField source="cartId" label="Cart ID" />
                    <TextField source="email" label="Email " />
                    <TextField source="totalPrice" label="Total Price" />
                </Datagrid>               
            </List>
        
        );
    };  

    export const CartShow = () => {
        const location = useLocation();
        const queryParams = new URLSearchParams(location.search);
        const notify = useNotify();
        const refresh = useRefresh();
        const redirect = useRedirect();
        const emailParam = queryParams.get("email");
        const onError = (error: { message: any; }) => {
            notify(`Could not load cart: ${error.message}` , { type: 'error' });
            redirect('/carts');
            refresh();
        };
        
        if (!emailParam) {
            return <span>Error: Email is required</span>;
        }

        return(
            <Show queryOptions={{ 
                meta:{email: emailParam},
                onError,
             }}>
                <SimpleShowLayout >
                    <CustomPDFButton />
                    <TextField source="id" label="Cart ID" />
                    <TextField source="email" label="Email "  />
                    <NumberField source="totalPrice" label="Total Price"  />
                    <ArrayField source="cartItems" label="Cart Items">
                        <Datagrid rowClick={false}>
                            <TextField source="product.id" label="Product ID" />
                            <TextField source="product.productName" label="Product Name" />
                            <ImageField source="product.image" label="Image" />
                            {/* <TextField source="product.description" label="Description" /> */}
                            <NumberField source="quantity" label="Quantity" />
                            <NumberField source="product.price" label="Price" />
                            <NumberField source="product.discount" label="Discount" />
                            <NumberField source="product.specialPrice" label="Special Price" />
                            <TextField source="product.category.name" label="Category" />
                        </Datagrid>
                    </ArrayField>
                </SimpleShowLayout>
            </Show> 
            
        );
    }
