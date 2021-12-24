# Contact App
This repository contains a back-end for a simple contact management app along with other important documentation as part of the #tech4impact syllabus. The tech stack used is Node JS, Express, MongoDB, and Mongoose.

## Outline BRD & Wireframe
[Link to BRD and wireframe](https://whimsical.com/outline-brd-5EtbJk3uT4zwjQo1MteiVA)

## Installation
Use the package manager npm to install project
```bash
npm install
```

## Run
Use the package manager npm to run project
```bash
npm dev or npm start
```
1. Create a file named .env in the root.
2. Add the following two env variables to be used in the app :
```bash
mongodbURI=
jwtSecret=
```
3. Set up the values of the two fields with your own MongoDB connection URI and your own JWT secret key.

## MongoDB Schemas and Entity Relationship Diagram
<img alt="DesignDB" src="https://raw.githubusercontent.com/nurultrsa/backend-project/feature-nurul/img/ERD2.png">

## Documentation for API Endpoints
## Auth service
- Header : application/json (accept)

| Method               | Description                              | Body Fields          | Authentication |
| -------------------- | ---------------------------------------- | -------------------- | -------------- |
| GET /auth            | Get details of logged in users info      |                      | **required**   |

Response:
```bash
{
    "code" : "number",
    "status" : "string",
    "data" : {
         "id" : "string, unique",
         "name" : "string",
         "email" : "string",
         "password" : "string",
         "createdAt" : "date",
         "updatedAt" : "date"
     }
}
```

- Header : application/json (accept, content-type)

| Method               | Description                              | Required Body Fields | Authentication |
| -------------------- | ---------------------------------------- | -------------------- | -------------- |
| POST /auth           | Returns user authentication and token    | `email, password`    | not required   |

Response:
```bash
{
    "code" : "number",
    "status" : "string",
    "data" : {
         "id" : "string, unique",
         "email" : "string",
         "password" : "string",
         "createdAt" : "date",
         "updatedAt" : "date"
     }
}
```

## Contacts service
- Header : application/json (accept)

| Method               | Description                              | Required Body Fields | Authentication |
| -------------------- | ---------------------------------------- | -------------------- | -------------- |
| GET /contacts        | Get all the contacts of logged in user   |                      | **required**   |

Response:
```bash
{
    "code" : "number",
    "status" : "string",
    "data" : {
         "id" : "string, unique",
         "name" : "string",
         "email" : "string, unique",
         "phone" : "string, unique",
         "type" : "string",
         "createdAt" : "date",
         "updatedAt" : "date"
     }
     {
         "id" : "string, unique",
         "name" : "string",
         "email" : "string, unique",
         "phone" : "string, unique",
         "type" : "string",
         "createdAt" : "date",
         "updatedAt" : "date"
     }
}
```

- Header : application/json (accept, content-type)

| Method               | Description                              | Required Body Fields | Authentication |
| -------------------- | ---------------------------------------- | -------------------- | -------------- |
| POST /contacts       | Add a new contact for user               | `name, email, phone, type`| **required**   |

Response:
```bash
{
    "code" : "number",
    "status" : "string",
    "data" : {
         "id" : "string, unique",
         "name" : "string",
         "email" : "string, unique",
         "phone" : "string, unique",
         "type" : "string",
         "createdAt" : "date",
         "updatedAt" : "date"
     }
}
```

- Header : application/json (accept, content-type)

| Method               | Description                              | Required Body Fields | Authentication |
| -------------------- | ---------------------------------------- | -------------------- | -------------- |
| PUT /contacts/:id    | Update a contact for logged in user      | `name, email, phone, type`| **required**   |

Response:
```bash
{
    "code" : "number",
    "status" : "string",
    "data" : {
         "id" : "string, unique",
         "name" : "string",
         "email" : "string, unique",
         "phone" : "string, unique",
         "type" : "string",
         "createdAt" : "date",
         "updatedAt" : "date"
     }
}
```

- Header : application/json (accept)

| Method               | Description                              | Required Body Fields | Authentication |
| -------------------- | ---------------------------------------- | -------------------- | -------------- |
| DELETE /contacts/:id | Delete a contact for logged in user      |                      | **required**   |

Response:
```bash
{
    "code" : "number",
    "status" : "string"
}
```


## Users service
- Header : application/json (accept, content-type)

| Method               | Description                              | Required Body Fields | Authentication |
| -------------------- | ---------------------------------------- | -------------------- | -------------- |
| POST /users          | Register a user and generate JWT token   | `name, email, password`| not required   |

Response:
```bash
{
    "code" : "number",
    "status" : "string",
    "data" : {
         "id" : "string, unique",
         "name" : "string",
         "email" : "string",
         "password" : "string",
         "createdAt" : "date",
         "updatedAt" : "date"
     }
}
```

### Folder Structure

-   All folders without node modules, .gitignore, and .env file.

```

.
├── README.md
├── index.js
├── package-lock.json
├── package.json
├── config
│   ├── db.js
├── middlewares
│   ├── auth.js
├── models
│   ├── contract.js
│   ├── user.js
├── routes
│   ├── auth.js
│   ├── contract.js
│   ├── users.js

