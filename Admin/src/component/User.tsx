import { List, useRecordContext, Link, Datagrid, TextField, ImageField, NumberField, Create, Edit, SimpleForm, TextInput,
    NumberInput, ImageInput, ReferenceInput, SelectInput, EditButton, DeleteButton, 
    ShowButton,
    EmailField,
    OptionalResourceContextProvider,
    PasswordInput} from 'react-admin';


    
    export const UserList = () => (
    <List >
        <Datagrid rowClick={false}>
            <TextField source="userId" label="User ID" />
            <TextField source="firstName" label="First Name" />
            <TextField source="lastName" label="Last Name" />
            <TextField source="mobileNumber" label="mobileNumber" />
            <EmailField source="email" label="Email" />
            <TextField source="roles[0].roleName" label="Role Name" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);
export const UserCreate = () => (
    <Create>
        <SimpleForm>

            <TextInput source="firstName" label="First Name" />
            <TextInput source="lastName" label="Last Name" />
            <TextInput source="mobileNumber" label="mobileNumber" />
            <TextInput source="email" label="Email" />
            <PasswordInput source="password" label="Password" />
            <SelectInput
                source="roles"
                optionText="roleName"
                choices={[
                    { id: "101", roleName: "ADMIN" },
                    { id: "102", roleName: "USER" },
                ]}
            />
            <TextInput source="address.ward" label="ward" />
            <TextInput source="address.buildingName" label="buildingName" />
            <TextInput source="address.city" label="city" />
            <TextInput source="address.district" label="district" />
            <TextInput source="address.country" label="country" />
            <TextInput source="address.pincode" label="pincode" />

        </SimpleForm>
        
    </Create>

    );
    
    export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="userId" disabled/>
            <TextInput source="firstName" label="First Name" />
            <TextInput source="lastName" label="Last Name" />
            <TextInput source="mobileNumber" label="mobileNumber" />
            <TextInput source="email" label="Email" />
            <SelectInput
                source="roles[0].roleId"
                optionText="roleName"
                choices={[
                    { id: "101", roleName: "ADMIN" },
                    { id: "102", roleName: "USER" },
                ]}
                label="Role"
            />
            <TextInput source="password" label="Password" />
            <TextInput source="address.ward" label="ward" />
            <TextInput source="address.buildingName" label="buildingName" />
            <TextInput source="address.city" label="city" />
            <TextInput source="address.district" label="district" />
            <TextInput source="address.country" label="country" />
            <TextInput source="address.pincode" label="pincode" />
        </SimpleForm>
    </Edit>

);