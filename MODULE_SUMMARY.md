# UK ERP System - Module Summary

## Core Modules and API Endpoints

### 1. Authentication
- **Login**: POST `/api/auth/login`
- **Register**: POST `/api/auth/register`
- **Profile**: GET `/api/auth/profile`

### 2. User/Employee Management
- **Create**: POST `/api/user`
- **List**: GET `/api/user`
- **Detail**: GET `/api/user/:id`
- **Update**: PUT `/api/user/:id`
- **Delete**: DELETE `/api/user/:id`

### 3. Site Management
- **Create**: POST `/api/site`
- **List**: GET `/api/site`
- **Detail**: GET `/api/site/:id`
- **Update**: PUT `/api/site/:id`
- **Delete**: DELETE `/api/site/:id`

### 4. Work Order Management
- **Create**: POST `/api/work-order`
- **List**: GET `/api/work-order`
- **Detail**: GET `/api/work-order/:id`
- **Update**: PUT `/api/work-order/:id`
- **Delete**: DELETE `/api/work-order/:id`

### 5. Role Management
- **Create**: POST `/api/role`
- **List**: GET `/api/role`
- **Detail**: GET `/api/role/:id`
- **Update**: PUT `/api/role/:id`
- **Delete**: DELETE `/api/role/:id`

### 6. Tools/Machinery/Equipment Management
- **Create**: POST `/api/tool`
- **List**: GET `/api/tool`
- **Detail**: GET `/api/tool/:id`
- **Update**: PUT `/api/tool/:id`
- **Delete**: DELETE `/api/tool/:id`

### 7. Checklist Management
- **Create**: POST `/api/checklist`
- **List**: GET `/api/checklist`
- **Detail**: GET `/api/checklist/:id`
- **Update**: PUT `/api/checklist/:id`
- **Delete**: DELETE `/api/checklist/:id`
- **Update Item**: PUT `/api/checklist/:id/items`

### 8. Measurement Details (DPR)
- **Create**: POST `/api/dpr`
- **List**: GET `/api/dpr`
- **Detail**: GET `/api/dpr/:id`
- **Update**: PUT `/api/dpr/:id`
- **Delete**: DELETE `/api/dpr/:id`
- **Approve**: PUT `/api/dpr/:id/approve`

### 9. Procurement Order Management
- **Create**: POST `/api/procurement`
- **List**: GET `/api/procurement`
- **Detail**: GET `/api/procurement/:id`
- **Update**: PUT `/api/procurement/:id`
- **Delete**: DELETE `/api/procurement/:id`
- **Approve**: PUT `/api/procurement/:id/approve`
- **Update Status**: PUT `/api/procurement/:id/status`

### 10. Attendance Management
- **Create**: POST `/api/attendance`
- **Bulk Create**: POST `/api/attendance/bulk`
- **List**: GET `/api/attendance`
- **Detail**: GET `/api/attendance/:id`
- **Update**: PUT `/api/attendance/:id`
- **Delete**: DELETE `/api/attendance/:id`
- **Approve**: PUT `/api/attendance/:id/approve`

### 11. Payment Sheet
- **Create**: POST `/api/payment`
- **List**: GET `/api/payment`
- **Detail**: GET `/api/payment/:id`
- **Update**: PUT `/api/payment/:id`
- **Delete**: DELETE `/api/payment/:id`
- **Approve**: PUT `/api/payment/:id/approve`
- **Mark as Paid**: PUT `/api/payment/:id/paid`

### 12. Expense Sheet (Site/Office)
- **Create**: POST `/api/expense`
- **List**: GET `/api/expense`
- **Detail**: GET `/api/expense/:id`
- **Update**: PUT `/api/expense/:id`
- **Delete**: DELETE `/api/expense/:id`
- **Approve**: PUT `/api/expense/:id/approve`
- **Mark as Paid**: PUT `/api/expense/:id/paid`

### 13. Permission Management
- **Create**: POST `/api/permission`
- **List**: GET `/api/permission`
- **Detail**: GET `/api/permission/:id`
- **Update**: PUT `/api/permission/:id`
- **Delete**: DELETE `/api/permission/:id`
- **Check Permission**: GET `/api/permission/check`
- **Get Role Permissions**: GET `/api/permission/role/:roleId`

## Role-Based Access Control

### Roles in the System:
1. Site I/c (Project Manager)
2. Department Technical I/c
3. Shift I/c / Supervisor
4. Store I/c
5. Store Admin
6. Store Keeper
7. Admin
8. Account
9. HR

Each role has specific permissions for different modules as defined in the permission system.