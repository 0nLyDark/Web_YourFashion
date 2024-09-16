import { List, Datagrid, TextField, DeleteButton, EditButton, Create, Edit, SimpleForm, TextInput, ReferenceInput, SelectInput } from "react-admin";

export const CategoryList = () => (
    <List>
        <Datagrid>
            <TextField source="categoryId" label="Category ID" />
            <TextField source="categoryName" label="Category Name" />
            <TextField source="categoryParent.categoryName" label="Category Parent" />

            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>

);

export const CategoryCreate = () => (
    <Create >
        <SimpleForm>
            <TextInput source="categoryName" label="Category Name" />
            <ReferenceInput source="categoryParent.categoryId" resource="categoryId" reference="categories" label="Category Parent">
                <SelectInput optionText="categoryName" />
            </ReferenceInput>
        </SimpleForm>
    </Create>

);

export const CategoryEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="categoryId" label="Category ID" disabled />
            <TextInput source="categoryName" label="Category Name" />
            <ReferenceInput source="categoryParent.categoryId" resource="categoryParent.categoryId" reference="categories" label="Category Parent">
                <SelectInput optionText="categoryName" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>

);