# UK ERP System API Documentation

## Authentication

### Login
**POST** `/api/auth/login`
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "user123"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "status": 200,
    "msg": "Login successful",
    "data": {
      "user": { /* user object */ },
      "token": "jwt-token"
    }
  }
  ```

### Register
**POST** `/api/auth/register`
- Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    // ... other user fields
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "status": 201,
    "msg": "User registered successfully",
    "data": {
      "user": { /* user object */ },
      "token": "jwt-token"
    }
  }
  ```

### Get Profile
**GET** `/api/auth/profile`
- Headers: `Authorization: Bearer <token>`
- Response:
  ```json
  {
    "success": true,
    "status": 200,
    "msg": "Profile retrieved successfully",
    "data": { /* user object */ }
  }
  ```

## Users

### Create User
**POST** `/api/user`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    // ... other user fields
  }
  ```

### Get Users
**GET** `/api/user`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status`
  - `searchText`
  - `sortBy` (default: "updatedAt,-1")

### Get User by ID
**GET** `/api/user/:id`
- Headers: `Authorization: Bearer <token>`

### Update User
**PUT** `/api/user/:id`
- Headers: `Authorization: Bearer <token>`
- Request Body: User fields to update

### Delete User
**DELETE** `/api/user/:id`
- Headers: `Authorization: Bearer <token>`

## Roles

### Create Role
**POST** `/api/role`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "role_name": "Project Manager",
    "role_shorthand": "PM"
  }
  ```

### Get Roles
**GET** `/api/role`
- Headers: `Authorization: Bearer <token>`

### Get Role by ID
**GET** `/api/role/:id`
- Headers: `Authorization: Bearer <token>`

### Update Role
**PUT** `/api/role/:id`
- Headers: `Authorization: Bearer <token>`

### Delete Role
**DELETE** `/api/role/:id`
- Headers: `Authorization: Bearer <token>`

## Sites

### Create Site
**POST** `/api/site`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "name": "Construction Site A",
    "site_shorthand": "CSA",
    "location": "123 Main St, City"
  }
  ```

### Get Sites
**GET** `/api/site`
- Headers: `Authorization: Bearer <token>`

### Get Site by ID
**GET** `/api/site/:id`
- Headers: `Authorization: Bearer <token>`

### Update Site
**PUT** `/api/site/:id`
- Headers: `Authorization: Bearer <token>`

### Delete Site
**DELETE** `/api/site/:id`
- Headers: `Authorization: Bearer <token>`

## Work Orders

### Create Work Order
**POST** `/api/work-order`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "workOrderNumber": "WO-001",
    "title": "Building Construction",
    "description": "Construct a 3-story building",
    "site": "site-id",
    "startDate": "2023-01-01",
    "endDate": "2023-12-31",
    "budget": 1000000
  }
  ```

### Get Work Orders
**GET** `/api/work-order`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status`
  - `searchText`
  - `sortBy` (default: "createdAt,-1")

### Get Work Order by ID
**GET** `/api/work-order/:id`
- Headers: `Authorization: Bearer <token>`

### Update Work Order
**PUT** `/api/work-order/:id`
- Headers: `Authorization: Bearer <token>`

### Delete Work Order
**DELETE** `/api/work-order/:id`
- Headers: `Authorization: Bearer <token>`

## Tools/Machinery/Equipment

### Create Tool
**POST** `/api/tool`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "name": "Excavator",
    "code": "EXC-001",
    "category": "Heavy Machinery",
    "purchaseDate": "2022-01-01",
    "purchaseCost": 500000
  }
  ```

### Get Tools
**GET** `/api/tool`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status`
  - `category`
  - `searchText`
  - `sortBy` (default: "createdAt,-1")

### Get Tool by ID
**GET** `/api/tool/:id`
- Headers: `Authorization: Bearer <token>`

### Update Tool
**PUT** `/api/tool/:id`
- Headers: `Authorization: Bearer <token>`

### Delete Tool
**DELETE** `/api/tool/:id`
- Headers: `Authorization: Bearer <token>`

## Checklists

### Create Checklist
**POST** `/api/checklist`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "title": "Safety Inspection",
    "workOrder": "work-order-id",
    "site": "site-id",
    "items": [
      {
        "item": "Check safety equipment"
      },
      {
        "item": "Inspect machinery"
      }
    ]
  }
  ```

### Get Checklists
**GET** `/api/checklist`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status`
  - `workOrder`
  - `searchText`
  - `sortBy` (default: "createdAt,-1")

### Get Checklist by ID
**GET** `/api/checklist/:id`
- Headers: `Authorization: Bearer <token>`

### Update Checklist
**PUT** `/api/checklist/:id`
- Headers: `Authorization: Bearer <token>`

### Delete Checklist
**DELETE** `/api/checklist/:id`
- Headers: `Authorization: Bearer <token>`

### Update Checklist Item
**PUT** `/api/checklist/:id/items`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "itemId": "item-id",
    "isCompleted": true,
    "remarks": "Completed successfully"
  }
  ```

## Daily Progress Reports (DPR)

### Create DPR
**POST** `/api/dpr`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "date": "2023-01-01",
    "workOrder": "work-order-id",
    "site": "site-id",
    "workDescription": "Foundation work completed",
    "workProgress": 25,
    "materialsUsed": [
      {
        "materialName": "Cement",
        "quantity": 100,
        "unit": "bags"
      }
    ]
  }
  ```

### Get DPRs
**GET** `/api/dpr`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `workOrder`
  - `site`
  - `date`
  - `sortBy` (default: "date,-1")

### Get DPR by ID
**GET** `/api/dpr/:id`
- Headers: `Authorization: Bearer <token>`

### Update DPR
**PUT** `/api/dpr/:id`
- Headers: `Authorization: Bearer <token>`

### Delete DPR
**DELETE** `/api/dpr/:id`
- Headers: `Authorization: Bearer <token>`

### Approve DPR
**PUT** `/api/dpr/:id/approve`
- Headers: `Authorization: Bearer <token>`

## Procurement Orders

### Create Procurement
**POST** `/api/procurement`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "procurementNumber": "PO-001",
    "title": "Materials for Foundation",
    "workOrder": "work-order-id",
    "site": "site-id",
    "requiredByDate": "2023-01-15",
    "items": [
      {
        "itemName": "Cement",
        "quantity": 100,
        "unit": "bags",
        "rate": 300,
        "total": 30000
      }
    ]
  }
  ```

### Get Procurements
**GET** `/api/procurement`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status`
  - `workOrder`
  - `site`
  - `searchText`
  - `sortBy` (default: "createdAt,-1")

### Get Procurement by ID
**GET** `/api/procurement/:id`
- Headers: `Authorization: Bearer <token>`

### Update Procurement
**PUT** `/api/procurement/:id`
- Headers: `Authorization: Bearer <token>`

### Delete Procurement
**DELETE** `/api/procurement/:id`
- Headers: `Authorization: Bearer <token>`

### Approve Procurement
**PUT** `/api/procurement/:id/approve`
- Headers: `Authorization: Bearer <token>`

### Update Procurement Status
**PUT** `/api/procurement/:id/status`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "status": "ordered" // or "delivered"
  }
  ```

## Attendance

### Create Attendance
**POST** `/api/attendance`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "date": "2023-01-01",
    "user": "user-id",
    "site": "site-id",
    "workOrder": "work-order-id",
    "status": "present",
    "inTime": "2023-01-01T08:00:00Z",
    "outTime": "2023-01-01T17:00:00Z"
  }
  ```

### Get Attendances
**GET** `/api/attendance`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status`
  - `site`
  - `workOrder`
  - `date`
  - `user`
  - `sortBy` (default: "date,-1")

### Get Attendance by ID
**GET** `/api/attendance/:id`
- Headers: `Authorization: Bearer <token>`

### Update Attendance
**PUT** `/api/attendance/:id`
- Headers: `Authorization: Bearer <token>`

### Delete Attendance
**DELETE** `/api/attendance/:id`
- Headers: `Authorization: Bearer <token>`

### Approve Attendance
**PUT** `/api/attendance/:id/approve`
- Headers: `Authorization: Bearer <token>`

### Bulk Create Attendance
**POST** `/api/attendance/bulk`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "attendances": [
      {
        "date": "2023-01-01",
        "user": "user-id-1",
        "site": "site-id",
        "status": "present"
      },
      {
        "date": "2023-01-01",
        "user": "user-id-2",
        "site": "site-id",
        "status": "present"
      }
    ]
  }
  ```

## Payments

### Create Payment
**POST** `/api/payment`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "paymentNumber": "PAY-001",
    "title": "Salary Payment",
    "user": "user-id",
    "site": "site-id",
    "workOrder": "work-order-id",
    "amount": 50000,
    "paymentType": "salary",
    "paymentDate": "2023-01-01"
  }
  ```

### Get Payments
**GET** `/api/payment`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status`
  - `site`
  - `workOrder`
  - `user`
  - `paymentType`
  - `sortBy` (default: "paymentDate,-1")

### Get Payment by ID
**GET** `/api/payment/:id`
- Headers: `Authorization: Bearer <token>`

### Update Payment
**PUT** `/api/payment/:id`
- Headers: `Authorization: Bearer <token>`

### Delete Payment
**DELETE** `/api/payment/:id`
- Headers: `Authorization: Bearer <token>`

### Approve Payment
**PUT** `/api/payment/:id/approve`
- Headers: `Authorization: Bearer <token>`

### Mark Payment as Paid
**PUT** `/api/payment/:id/paid`
- Headers: `Authorization: Bearer <token>`

## Expenses

### Create Expense
**POST** `/api/expense`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "expenseNumber": "EXP-001",
    "title": "Office Supplies",
    "site": "site-id",
    "workOrder": "work-order-id",
    "category": "Office",
    "amount": 5000,
    "expenseDate": "2023-01-01"
  }
  ```

### Get Expenses
**GET** `/api/expense`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status`
  - `site`
  - `workOrder`
  - `category`
  - `sortBy` (default: "expenseDate,-1")

### Get Expense by ID
**GET** `/api/expense/:id`
- Headers: `Authorization: Bearer <token>`

### Update Expense
**PUT** `/api/expense/:id`
- Headers: `Authorization: Bearer <token>`

### Delete Expense
**DELETE** `/api/expense/:id`
- Headers: `Authorization: Bearer <token>`

### Approve Expense
**PUT** `/api/expense/:id/approve`
- Headers: `Authorization: Bearer <token>`

### Mark Expense as Paid
**PUT** `/api/expense/:id/paid`
- Headers: `Authorization: Bearer <token>`

## Permissions

### Create Permission
**POST** `/api/permission`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "role": "role-id",
    "module": "user",
    "permissions": {
      "create": true,
      "read": true,
      "update": true,
      "delete": false
    }
  }
  ```

### Get Permissions
**GET** `/api/permission`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `role`
  - `module`
  - `sortBy` (default: "createdAt,-1")

### Get Permission by ID
**GET** `/api/permission/:id`
- Headers: `Authorization: Bearer <token>`

### Update Permission
**PUT** `/api/permission/:id`
- Headers: `Authorization: Bearer <token>`

### Delete Permission
**DELETE** `/api/permission/:id`
- Headers: `Authorization: Bearer <token>`

### Check Permission
**GET** `/api/permission/check`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `roleId`
  - `module`
  - `action` (create, read, update, delete)

### Get Role Permissions
**GET** `/api/permission/role/:roleId`
- Headers: `Authorization: Bearer <token>`