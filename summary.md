# Project Summary: UKE Backend

## Overview
This is a Node.js backend application built with Express.js. It is designed to manage Users, Roles, and Sites. The application includes functionality for CRUD operations, file uploads, pagination, search, and sorting.

## Project Structure
Based on the provided files, here is the project structure:

```
ukebackend/
├── server.js                  # Main entry point (Express app setup)
├── src/
│   ├── config/
│   │   └── connection.js      # Database connection setup
│   ├── controllers/           # Business logic for API endpoints
│   │   ├── roleController.js
│   │   ├── siteController.js
│   │   └── userController.js
│   ├── helpers/               # Utility functions
│   │   ├── apiHelper.js       # Standardized response helpers
│   │   └── fileUpload.js      # File upload handling logic
│   ├── middlewares/
│   │   └── auth.js            # Authentication middleware
│   ├── models/                # Mongoose models (Database Schemas)
│   │   ├── role.js
│   │   ├── site.js
│   │   └── users.js
│   └── routes/                # API Route definitions
│       ├── index.js           # Main router aggregating all routes
│       ├── roleRoute.js
│       ├── siteRoute.js
│       └── userRoute.js
└── .env                       # Environment variables configuration
```

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (using Mongoose ODM)
- **Key Libraries**:
  - `cors`: For handling Cross-Origin Resource Sharing.
  - `express-fileupload`: For handling multipart file uploads.
  - `dotenv`: For managing environment variables.

## Modules & Features

### 1. User Management (`/api/user`)
- **Create**: Registers new users. Supports uploading multiple documents (Aadhar, PAN, Certificates, Medical, etc.).
- **Read**: Fetches users with pagination, sorting, and search capabilities. Includes specific fetching by ID.
- **Update**: Updates user details via ID.
- **Delete**: Removes a user record.

### 2. Role Management (`/api/role`)
- **Create**: Adds new roles to the system.
- **Read**: Lists roles with pagination and search filters.
- **Delete**: Removes roles.

### 3. Site Management (`/api/site`)
- **Create**: Adds new sites.
- **Read**: Lists sites with pagination and search filters.
- **Update**: Updates site details via ID.
- **Delete**: Removes sites.

## API Endpoints

### User Routes
- `POST /api/user/create`
- `POST /api/user/get-users`
- `POST /api/user/get-user-by-id`
- `POST /api/user/update-user-by-id/:id`
- `POST /api/user/delete-user-by-id`

### Role Routes
- `POST /api/role/create`
- `POST /api/role/get-roles`
- `POST /api/role/get-roles-by-id`
- `POST /api/role/delete-roles-by-id`

### Site Routes
- `POST /api/site/create`
- `POST /api/site/get-sites`
- `POST /api/site/get-site-by-id`
- `POST /api/site/update-site-by-id/:id`
- `POST /api/site/delete-site-by-id`

## Server Configuration
- **Port**: Defaults to 5000 (or as defined in `.env`).
- **Static Files**: Uploaded files are served from `/uploads`.
- **Logging**: Includes a custom middleware to log incoming requests (`[DEBUG] Incoming Request...`) to the console.