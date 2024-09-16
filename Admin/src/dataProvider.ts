import { CreateParams, CreateResult, DataProvider, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult,
  email,
  GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, GetOneParams, GetOneResult, Identifier,
  QueryFunctionContext, RaRecord, UpdateManyParams, UpdateManyResult, UpdateParams, UpdateResult } from 'react-admin';
  import axios from 'axios';
  const apiUrl = 'http://localhost:8080/api';
  
  const httpClient = {
  get: (url: string) => {
    const token = localStorage.getItem('jwt-token');
  
    return axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      }).then(response => ({ json: response.data }))
      .catch(error => {
        console.error('API request failed:', error);
        throw error;
      });
  },
      
  
  post: (url: string, data: any) => {
  const token = localStorage.getItem('jwt-token');
  console.log(token);
    return axios.post(url, data, {
      headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      },
      withCredentials: true,
      }). then(response => ({ json: response.data }))
      .catch(error => {
        console.error('API request failed:', error);
        throw error;
      });
  },

  put: (url: string, data: any) => {
  const token = localStorage.getItem('jwt-token');
    return axios.put(url, data, {
      headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      },
      withCredentials: true,
      }).then(response => ({ json: response.data }))
      .catch(error => {
        console.error('API request failed:', error);
        throw error;
      });
  },

  delete: (url: string, p0: { data: { ids: any[]; }; }) => {
  const token = localStorage.getItem('jwt-token');

    return axios.delete(url, {
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        },
        withCredentials: true,
        }).then(response => ({ json: response.data }))
        . catch(error => {
        console.error('API request failed:', error);
        throw error;
      });
  },
};

export const dataProvider: DataProvider = {

  getList: (resource: string, { pagination = {}, sort = {}, filter = {} }) => {
  const { page = 0, perPage = 10 } = pagination;
  const { field = 'id', order = 'ASC' } = sort;
    
    const idFieldMapping: { [key: string]: string; } = {
    products: 'productId',
    categories: 'categoryId',
    carts: 'cartId',
    orders: 'orderId',
    users: 'userId',

    // Add more mappings as needed

    };
  
    // Determine the ID field based on the resource
    const idField = idFieldMapping[resource] || 'id';
    
    const query = {
      pageNumber: page.toString(),
      pageSize: perPage.toString(),
      sortBy: field,
      sortOrder: order,
      sale:false,
      ... filter
    };
    console. log('Request filter:', filter);
    let url: string;
    if (filter && filter.search) {
      const keyword = filter.search;
      delete query.search;
      url = `${apiUrl}/public/${resource}/keyword/${encodeURIComponent(keyword) }?${new
      URLSearchParams (query).toString()}`;
    }else if(filter && filter.categoryId){
      const categoryId = filter.categoryId;
      delete query.categoryId;
      url = `${apiUrl}/public/categories/${categoryId}/${resource}?${new URLSearchParams(query).toString()}` ;
    }else if( resource === "carts" || resource === "orders" || resource === "users" ){
      url =`${apiUrl}/admin/${resource}?${new URLSearchParams(query).toString()}`;
      console.log(url);
    }else{
      url =`${apiUrl}/public/${resource}?${new URLSearchParams(query).toString()}` ;
    }
    console. log('Request URL:', url);
    
    return httpClient.get(url).then(({ json }) => {
      const baseUrl = 'http://localhost:8080/api/public/products/image/';
      const data = json.content.map((item: { [x: string]: any; image: any; }) => ({
        id: item[idField],
        ... item,
        image: item.image ? `${baseUrl}${item.image}` : null
      }));
      console.log("data list:",data);
      return {
        data,
        total: json.totalElements
      };
    });
  },
  delete: async <RecordType extends RaRecord = any>(resource: string, params: DeleteParams<RecordType>):
  Promise<DeleteResult<RecordType>> => {
    try {
    // Construct the URL for the DELETE request
    const url = `${apiUrl}/admin/${resource}/${params.id}` ;

          // Perform the DELETE request
          await httpClient.delete(url, {
            data: {
              ids: [params.id], // Assuming you want to pass the ID of the item to delete
            },
          });
          // Return an empty result
          return {
            data: params.previousData as RecordType,
          };
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error('Error deleting record');
    }
  },
    deleteMany: async <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteManyParams
    ): Promise<DeleteManyResult<RecordType>> => {
    const { ids } = params;
    try {
    // Create an array of promises for each delete request
      const deletePromises = ids.map(id => {
        const url = `${apiUrl}/admin/${resource}/${id}`;
        return httpClient.delete(url, {
          data: {
            ids: [id], // Sending the ID as part of the request body, if needed
          },
        });
      });
      // Execute all delete requests in parallel
      await Promise.all(deletePromises);
      // Return the IDs of the deleted records
      return {
        data: ids,
      };
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error('Error deleting records');
    }
  },
  getManyReference: function <RecordType extends RaRecord = any>(resource: string, params: GetManyReferenceParams &
  QueryFunctionContext): Promise<GetManyReferenceResult<RecordType>> {
    throw new Error('Function not implemented. ');
  },
  updateMany: function <RecordType extends RaRecord = any>(resource: string, params: UpdateManyParams):
  Promise<UpdateManyResult<RecordType>> {
  throw new Error('Function not implemented. ');
  },
  create: async (resource: string, params: CreateParams): Promise<CreateResult> => {
    try {
      console.log("data", params);
      let url: string;
      if (resource === "products") {
        url = `${apiUrl}/admin/categories/${params.data.categoryId}/${resource}` ;
        delete params.data.categoryId;
        params.data.image = 'default.png' ;

      }else if(resource === "users"){
          url = `${apiUrl}/register` ;
          if(params.data.roles == "101"){
            params.data.roles = [{
              roleId:101,
              roleName:"ADMIN"
            }]
          }else{
              params.data.roles = [{
                roleId:102,
                roleName:"USER"
              }]
          }
          params.data.userId=0;
      } else {
        url = `${apiUrl}/admin/${resource}`;
      }

      const { data } = params;
      console.log("params:",data);
      const result = await httpClient.post(url, data);
      return { data: { ... data, id: result.json.id } };
    } catch (error) {
      console.error("Error creating resource:", error);
      throw error; // Hoac xử lý lỗi tuy theo nhu cầu của bạn
    }
  },
  update: async (resource: string, params: UpdateParams): Promise<UpdateResult> => {
    let path= "admin";
    console.log("aaaaaaaaa",params);
    if(resource === "users"){
      delete params.data.cart
      path="public";
      if(params.data.roles[0].roleId == "101"){
        params.data.roles = [{
          roleId:101,
          roleName:"ADMIN"
        }]
      }else{
          params.data.roles = [{
            roleId:102,
            roleName:"USER"
          }]
      }
      params.data.userId=0;
    }
    const url = `${apiUrl}/${path}/${resource}/${params.id}`;
    const { data } = params;
    // set up category for product
    console.log("data AA:",data);
    if(resource === "products"){
      data["category"] = {categoryId:data['categoryId']};
      console.log("data BB:",data);
    }

    // Perform the PUT request to update the resource
    const result = await httpClient.put(url, data);
    // Assuming the API response contains the updated data with the correct 'id'
    const updatedData = {
      id: params.id, // Ensure 'id' is included in the response
      ... result. json
    };
    
    return { data: updatedData };
  },
  getOne: async (resource: string, params: GetOneParams): Promise<GetOneResult> => {
    console.log( 'getOne called for resource:', resource, 'with params:', params) ;
    
    let url: string;
    if (resource === "carts" || resource ==="orders") {
      url = `${apiUrl}/public/users/${params.meta.email}/${resource}/${params.id}` ;
    } else {
      url = `${apiUrl}/public/${resource}/${params.id}` ;
    }

    const result = await httpClient.get(url);
    const idFieldMapping: { [key: string]: string } = {
    products: 'productId',
    categories: 'categoryId',
    carts:'cartId',
    orders:'orderId',
    users: 'userId',

    // Add more mappings as needed
    };
    const idField = idFieldMapping[resource]
    const baseUrl = 'http://localhost:8080/api/public/products/image/'; // Base URL for product images
    let data;
    // Format the cart data
    if (resource === "carts") {
        data = {
          id: result.json[idField], // Correctly mapping the ID field
          email: result.json.email, 
          totalPrice: result.json.totalPrice,
          cartItems:result.json.cartItems.map((cartItem:any)=>({
            quantity:cartItem.quantity,
            product: {
              id: cartItem.product.productId,
            productName: cartItem.product.productName,
            image: cartItem.product.image ? `${baseUrl}${cartItem.product.image}` : null,
            description: cartItem.product.description,
            quantity: cartItem.product.quantity,
            price: cartItem.product.price,
            discount: cartItem.product.discount,
            specialPrice: cartItem.product.specialPrice,
            category: cartItem.product.category ? {
              id: cartItem.product.category.categoryId,
              name: cartItem.product.category.categoryName
              } : null,
            }
          }))
        };
    }else if(resource === "orders"){
        data = {
          id: result.json[idField], // Correctly mapping the ID field
          email: result.json.email,
          deliveryName: result.json.deliveryName, 
          deliveryPhone: result.json.deliveryPhone, 
          address:result.json.address.buildingName +"."+ result.json.address.ward+"."+ result.json.address.district+"."+ result.json.address.city,
          orderItems:result.json.orderItems.map( (orderItem: any) =>({
            id: orderItem.orderItemId,
            productName: orderItem.product.productName,
            image: orderItem.product.image ? `${baseUrl}${orderItem.product.image}` : null,
            quantity: orderItem.quantity,
            discount: orderItem.discount,
            orderedProductPrice: orderItem.orderedProductPrice,
            category: orderItem.product.category ? {
              id: orderItem.product.category.categoryId,
              name: orderItem.product.category.categoryName
              } : null,
          })),
          orderDate: result.json.orderDate,
          payment: result.json.payment,
          totalAmount: result.json.totalAmount,
          orderStatus: result.json.orderStatus,
        };
    }else{
      data = {
        id: result.json[idField],
        ... result.json
      };
    }
    console.log('data data:', data);
    return { data };
  },
  getMany: async (resource: string, params: GetManyParams): Promise<GetManyResult> => {
    const idFieldMapping: { [key: string]: string } = {
      products: 'productId',
      categories: 'categoryId',
      carts:'cartId',

      // Add more mappings as needed
    };
    console. log('Request resource:', resource);
    console. log('Request params:', params);

    const idField = idFieldMapping[resource] || 'id' ;

    // Construct the URL with the selected IDs
    const ids = params.ids. join(',');
    // const url = ${apiUr1}/public/${resource}?${idField}=${ids} ;
    let url: string;
    if (resource === "products") {
      url = `${apiUrl}/public/categories/${ids}/${resource}`;
    } else {
      url = `${apiUrl}/public/${resource}`;
    }
    console.log('Request URL getMany:', url);

    // Perform the GET requests
    const result = await httpClient.get(url);
    console. log('Request result:', result);
    console. log('Request result JSON: ', result. json);

    // Map the results to include the correct 'id' field
    const data = result.json.content.map((item: any) => ({
      id: item[idField],
      ... item,
    }));

    return { data };
  },

};