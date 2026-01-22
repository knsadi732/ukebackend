# User API Documentation

## Overview
This document details the API endpoints for User Management, including payload structures and usage details.

## Endpoints

### 1. Create User
**Endpoint**: `POST /api/user/create`
**Description**: Registers a new user. Supports uploading documents like Aadhar, PAN, Certificates, and Medical records.
**Content-Type**: `multipart/form-data`

**Payload Demo (FormData)**:
| Key | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Full name of the user |
| `email` | String | Email address |
| `phone` | String | Phone number (used for login) |
| `password` | String | User password (min 6 chars) |
| `role` | String[] | Array of Role ObjectIds |
| `site` | String[] | Array of Site ObjectIds |
| `workOrderNo` | String[] | Array of WorkOrder ObjectIds |
| `aadharFrontImage` | File | Aadhar card front image |
| `aadharBackImage` | File | Aadhar card back image |
| `panImage` | File | PAN card image |
| `certificate` | File[] | User certificates (send multiple files with the same key) |
| `medical` | String | Medical Status ("Yes"/"No") |
| `medicalCertificate` | File | Medical certificate document |
| `eyeTest` | String | Eye Test Status ("Yes"/"No") |
| `eyeTestMedical` | File | Eye test medical document |
| `uploadImage` | File | User profile upload image |
| `drivingLicenseImage` | File | Driving license image |

**Example Request (Raw)**:
```http
POST /api/user/create HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="name"

Amit Kumar
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="phone"

9876543210
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="password"

SecurePass123!
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="role"

65f2a1b3c4d5e6f7g8h9i0j1
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="site"

65f2a1b3c4d5e6f7g8h9i0j2
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="workOrderNo"

65f2a1b3c4d5e6f7g8h9i0j3
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="aadharFrontImage"; filename="aadhar_front.pdf"
Content-Type: application/pdf

(data)
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

### 2. Get Users
**Endpoint**: `POST /api/user/get-users`
**Description**: Retrieve a paginated list of users with optional search and sorting.
**Content-Type**: `application/json`

**Payload Demo**:
```json
{
  "page": 1,
  "limit": 10,
  "searchText": "Amit",
  "sortBy": "createdAt,-1"
}
```

### 3. Get User By ID
**Endpoint**: `POST /api/user/get-user-by-id`
**Description**: Get details of a specific user.
**Content-Type**: `application/json`

**Payload Demo**:
```json
{
  "id": "65f2a1b3c4d5e6f7g8h9i0j1"
}
```

### 4. Update User
**Endpoint**: `POST /api/user/update-user-by-id/:id`
**Description**: Update user details. Use `multipart/form-data` if updating files, otherwise `application/json` is sufficient.
**URL Params**: `id` (User ID)

**Payload Demo (JSON for Text-Only Updates)**:
```json
{
  "name": "Amit Kumar Updated",
  "email": "amit.new@example.com"
}
```

### 5. Delete User
**Endpoint**: `POST /api/user/delete-user-by-id`
**Description**: Delete a user record.
**Content-Type**: `application/json`

**Payload Demo**:
```json
{
  "id": "65f2a1b3c4d5e6f7g8h9i0j1"
}
```