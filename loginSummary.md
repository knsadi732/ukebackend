# Login API Implementation Summary

## Overview
Implemented a login API that allows users to authenticate using their **phone number** and **password**.

## Features
1.  **Input Validation**:
    - Checks if `phone` and `password` are present.
    - Enforces a minimum password length of **6 characters**.
2.  **Authentication**:
    - Verifies user existence via phone number.
    - Compares hashed passwords using `bcryptjs`.
3.  **Security**:
    - Generates a JWT token upon successful login.
    - **Absolute Expiry**: Token expires strictly after **4 hours**.
    - **Inactivity Expiry**: Session expires if no API call is made for **15 minutes**.
    - Middleware updated to verify tokens based on User ID.
    - Updates `lastActive` timestamp on every authenticated request.

## Files Created/Updated

### 1. `src/controllers/authController.js` (New)
- Contains the `login` logic.

### 2. `src/routes/authRoute.js` (New)
- Defines the POST `/login` route.

### 3. `src/routes/index.js` (Updated)
- Registered the auth routes under `/api/auth`.
- Endpoint: `POST /api/auth/login`

### 4. `src/middlewares/auth.js` (Updated)
- Updated token verification to use `id` from the token payload instead of `email`.

## Usage
**Endpoint**: `POST /api/auth/login`
**Body**:
```json
{
    "phone": "1234567890",
    "password": "yourpassword"
}
```