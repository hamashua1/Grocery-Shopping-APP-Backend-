# 🛒 Grocery Shopping App Backend

A robust RESTful API backend for a grocery shopping application built with Node.js, Express, and MongoDB. This application provides comprehensive user management, grocery item operations, and secure authentication features.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Models](#-models)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication with HTTP-only cookies
  - Secure password hashing with bcrypt
  - Password reset functionality via email

- **Grocery Item Management**
  - CRUD operations for grocery items
  - Category-based item organization (Fruits, Vegetables, Meat, Drinks)
  - Item completion status tracking
  - Category filtering and retrieval

- **Security Features**
  - Password encryption
  - JWT token authentication
  - CORS enabled
  - Secure cookie handling

- **Developer Experience**
  - Comprehensive Swagger/OpenAPI documentation
  - Clean layered architecture (Controller-Service-Model pattern)
  - RESTful API design
  - Error handling and validation

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer & Resend
- **Documentation**: Swagger UI Express
- **Cross-Origin**: CORS
- **Environment**: dotenv

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hamashua1/Grocery-Shopping-APP-Backend-.git
   cd Grocery-Shopping-APP-Backend-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:8000` (or the port specified in your environment variables).

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Email Configuration (for password reset)
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password

# Resend API Key (alternative email service)
RESEND_API_KEY=your_resend_api_key
```

## 📚 API Documentation

Interactive API documentation is available via Swagger UI:

- **Local**: `http://localhost:8000/api-docs`
- **API Info**: `http://localhost:8000/`

The API documentation provides detailed information about all endpoints, request/response formats, and authentication requirements.

## 📁 Project Structure

```
Grocery-Shopping-APP-Backend-/
├── app.js                 # Main application entry point
├── package.json           # Project dependencies and scripts
├── swagger.yaml           # API documentation
├── controllers/           # Request handlers
│   ├── emailController.js # Email operations
│   ├── itemController.js  # Item CRUD operations
│   └── loginController.js # Authentication logic
├── database/              # Database configuration
│   └── mongodb.js         # MongoDB connection setup
├── Models/                # Mongoose schemas
│   ├── item.js           # Grocery item model
│   └── login.js          # User model
├── routes/                # API route definitions
│   ├── auth/             # Authentication routes
│   ├── email/            # Email routes
│   └── item/             # Item routes
└── services/              # Business logic services
    └── emailService.js    # Email service implementation
```


The API uses JWT (JSON Web Tokens) for authentication:

1. **Registration/Login**: Users receive a JWT token stored in an HTTP-only cookie
2. **Protected Routes**: Include the token in subsequent requests
3. **Token Validation**: Server validates tokens for protected endpoints
4. **Security**: Tokens are stored securely in HTTP-only cookies with appropriate flags



## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Joshua Nun**
- GitHub: [@hamashua1](https://github.com/hamashua1)
- Project Link: [https://github.com/hamashua1/Grocery-Shopping-APP-Backend-](https://github.com/hamashua1/Grocery-Shopping-APP-Backend-)

---

⭐ Star this repository if you find it helpful!
