# 🚑 Rescue Track Backend

[![NestJS](https://img.shields.io/badge/NestJS-11.0.20-red.svg)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive **Rescue Track Management System** backend API built with NestJS and TypeScript, providing emergency services with advanced patient care reporting, inventory management, and administrative tools for healthcare professionals.

> This project was generated with [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.

## 🌐 API Documentation

**API Base URL:** `http://localhost:3000` (Development)  
**Production URL:** [Your Production URL]

### 🧪 Test Credentials

For testing purposes, you can use the following hospital ID:

- **Hospital ID:** `f6bb46fc-2cdc-478b-8fc8-899fff743b24`

This ID can be used to access the system and explore the various features including patient care reporting, inventory management, and dashboard analytics.

## 📋 Table of Contents

- [API Documentation](#-api-documentation)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#️-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Running the Application](#️-running-the-application)
- [Database Setup](#-database-setup)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Security](#-security)
- [Contributing](#-contributing)
- [Authors](#-authors)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization

- **Secure Login/Registration** with email and password
- **Microsoft OAuth Integration** for seamless authentication
- **Google OAuth Integration** for alternative login options
- **Password Reset** functionality with email verification
- **Multi-step Registration** process with validation
- **JWT Token Management** with automatic refresh
- **User Profile Management** with role-based access
- **Role-Based Access Control** (Admin, Doctor, Nurse, Employee)

### 🏥 Patient Care Reporting (PCR)

- **Comprehensive PCR API** with multi-step workflow
- **Patient Information Management** with detailed records
- **Medical Data Tracking** including vital signs and treatments
- **Incident Documentation** with crew and incident details
- **Treatment History** with medication and procedure tracking
- **Photo Upload** for patient documentation
- **Report Generation** in multiple formats (PDF, Excel)
- **Vital Signs Management** with real-time monitoring
- **Allergies & Medical Conditions** tracking
- **Trauma Documentation** with injury mechanisms

### 📊 Dashboard & Analytics

- **Real-time Statistics** with interactive data
- **Patient Demographics** analysis
- **Performance Metrics** and KPIs
- **Recent Activity** tracking
- **Staff Management** with role assignments
- **Data Aggregation** with advanced filtering
- **Export Capabilities** for reports and data
- **Database Monitoring** with connection metrics

### 📦 Inventory Management

- **Equipment Tracking** with detailed specifications
- **Medication Management** with stock levels and expiration
- **Supplier/Vendor Management** with contact information
- **Order Management** with status tracking
- **Stock Level Monitoring** with alerts
- **Inventory Reports** with analytics
- **Barcode/QR Code Support** for quick scanning
- **Maintenance Records** for equipment

### 📋 Report Management

- **Compliance Performance** reporting
- **Patient Care Reports** with detailed analytics
- **Run Reports** with customizable parameters
- **Report Templates** for standardized documentation
- **Export Functionality** (CSV, Excel, PDF)
- **Report History** and versioning
- **Automated Report Generation**

### 👥 Staff Management

- **Staff Directory** with role-based access
- **User Management** with profile information
- **Performance Tracking** and evaluations
- **Training Records** and certifications
- **Contact Information** management
- **Staff Analytics** and reporting
- **Administrator Panel** for system management

### 🏢 Profile & Settings

- **User Profile Management** with personal information
- **Account Settings** with preferences
- **Activity Log** with detailed history
- **Password Management** with security features
- **Notification Settings** and preferences
- **Hospital Context** management

### 📱 Additional Features

- **Multi-tenant Architecture** for hospital isolation
- **Database Connection Monitoring** with metrics
- **Email Services** with automated notifications
  - **Account Verification** - Email verification with OTP codes
  - **Password Recovery** - Secure password reset functionality
  - **System Notifications** - Automated alerts for important events
  - **Welcome Emails** - New user onboarding communications
  - **Report Notifications** - PCR and run report completion alerts
  - **Inventory Alerts** - Low stock and expiration notifications
- **Advanced Search** and filtering capabilities
- **Data Export** in multiple formats
- **Accessibility Features** for inclusive design
- **Real-time Notifications** with webhook support

## 🛠️ Tech Stack

### Core Technologies

- **[NestJS](https://nestjs.com/)** (v11.0.20) - Progressive Node.js framework
- **[Node.js](https://nodejs.org/)** (v20+) - JavaScript runtime environment
- **[TypeScript](https://www.typescriptlang.org/)** (v5.0) - Type-safe JavaScript
- **[PostgreSQL](https://www.postgresql.org/)** (v15+) - Primary database system

### Database & ORM

- **[TypeORM](https://typeorm.io/)** (v0.3.20) - Object-Relational Mapping
- **[Supabase](https://supabase.com/)** - Database hosting and management
- **Connection Pooling** for optimized database performance

### Authentication & Security

- **[Passport.js](https://www.passportjs.org/)** - Authentication middleware
- **[JWT](https://jwt.io/)** - JSON Web Tokens for secure authentication
- **[Argon2](https://argon2.online/)** - Password hashing algorithm
- **[bcrypt](https://github.com/dcodeIO/bcrypt.js/)** - Password hashing library
- **[Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)** - Google authentication
- **[Microsoft OAuth](https://docs.microsoft.com/en-us/azure/active-directory/develop/)** - Microsoft authentication

### Email Services

- **[Nodemailer](https://nodemailer.com/)** (v6.10.0) - Email sending library
  - **Email Verification** - OTP-based account verification
  - **Password Reset** - Secure password recovery emails
  - **Notification System** - Automated alerts and updates
  - **SMTP Configuration** - Gmail SMTP integration
  - **Template Support** - HTML email templates
  - **Error Handling** - Robust email delivery management
- **[Gmail SMTP](https://support.google.com/mail/answer/7126229)** - Email service provider

### Development Tools

- **[ESLint](https://eslint.org/)** (v9) - Code linting
- **[Prettier](https://prettier.io/)** (v3.4.2) - Code formatter
- **[Jest](https://jestjs.io/)** (v29.7.0) - Testing framework
- **[Docker](https://www.docker.com/)** - Containerization

### Validation & Utilities

- **[class-validator](https://github.com/typestack/class-validator)** (v0.14.1) - Validation decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** (v0.5.1) - Object transformation
- **[Joi](https://joi.dev/)** (v17.13.3) - Schema validation

## ⚙️ Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v20.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **PostgreSQL** (v15.0.0 or higher)
- **Git** (for version control)

### Development Setup

- **VS Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Docker

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/hassan-mahadjir/rescue-track-backend.git
cd rescue-track-backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=your_database_url
DATABASE_PORT=5432

# Supabase Configuration
SUPBASE_URL=your_supabase_url
SUPBASE_DIRECT_URL=your_supabase_direct_url
SUPBASE_PORT=5432

# ATK Database Configuration
ATK_MAIN_DATABASE_URL=your_atk_main_database_url
ATK_MAIN_DATABASE_PORT=5432
ATK_DATABASE_URL=your_atk_database_url
ATK_DATABASE_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d
REFRESH_JWT_SECRET=your_refresh_jwt_secret_key
REFRESH_JWT_EXPIRATION=7d

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

MICROSOFT_APPLICATION_ID=your_microsoft_application_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_CALLBACK_URL=http://localhost:3000/auth/microsoft/callback

# Email Configuration
GOOGLE_MAIL_USER=your_gmail_username
GOOGLE_MAIL_PASSWORD=your_gmail_app_password

# Server Configuration
HOST_IP_ADDRESS=localhost
PORT=3000
NODE_ENV=development
```

## ⚙️ Configuration

### NestJS Configuration

The application uses NestJS with the following key configurations:

- **App Router** for modern routing
- **TypeORM** for database management
- **JWT Authentication** with refresh tokens
- **OAuth Integration** for third-party authentication
- **Multi-tenant Architecture** for hospital isolation

### Database Configuration

Database setup includes:

- **Primary Database** for user and hospital management
- **Secondary Database** for tenant-specific data
- **Connection Pooling** for optimized performance
- **Migration Support** for schema management

### Authentication Setup

The application supports multiple authentication methods:

- **Local Authentication** with email/password
- **Google OAuth 2.0** for Google account integration
- **Microsoft OAuth** for Microsoft account integration
- **JWT Token Management** with automatic refresh

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Start the development server
npm run start:dev
# or
yarn start:dev
```

Open [http://localhost:3000](http://localhost:3000) to access the API.

### Production Build

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm run start:prod
# or
yarn start:prod
```

### Docker Deployment

```bash
# Build the Docker image
docker build -t rescue-track-backend .

# Run the container
docker run -p 3000:3000 rescue-track-backend
```

### Linting

```bash
# Run ESLint
npm run lint
# or
yarn lint

# Format code
npm run format
# or
yarn format
```

## 🗄️ Database Setup

### PostgreSQL Setup

1. **Install PostgreSQL** (v15 or higher)
2. **Create Database**:

```sql
CREATE DATABASE rescue_track_primary;
CREATE DATABASE rescue_track_secondary;
```

3. **Configure Connection** in `.env` file
4. **Run Migrations** (if applicable):

```bash
npm run migration:run
```

### Database Schema

The application uses the following main entities:

- **Users** - User accounts and authentication
- **Hospitals** - Hospital information and settings
- **Profiles** - User profile information
- **Patients** - Patient records and information
- **PatientCareReports** - Medical care reports
- **RunReports** - Emergency response reports
- **Equipment** - Medical equipment inventory
- **Medications** - Medication inventory
- **Suppliers** - Vendor information
- **Orders** - Purchase orders

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov

# Test in watch mode
npm run test:watch
```

### Test Structure

```
test/
├── app.e2e-spec.ts
└── jest-e2e.json
```

## 📁 Project Structure

```
src/
├── auth/                    # Authentication & authorization
│   ├── config/             # JWT and OAuth configurations
│   ├── decorators/         # Custom decorators
│   ├── guards/             # Authentication guards
│   ├── strategies/         # Passport strategies
│   └── types/              # Type definitions
├── entities/               # Database entities
│   ├── main/               # Core entities (User, Hospital, Profile)
│   └── ...                 # Feature-specific entities
├── administrator/          # Admin management
├── patient/               # Patient management
├── patient-care-report/   # Medical reports
├── run-report/            # Emergency response
├── supplier/              # Supplier management
├── order/                 # Order management
├── item/                  # Equipment & medication
├── user/                  # User management
├── profile/               # User profiles
├── mail/                  # Email services
├── database/              # Database management
├── config/                # Configuration files
├── enums/                 # Enum definitions
└── main.ts               # Application entry point
```

## 📡 API Endpoints

### Authentication (`/auth`)

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/admin/login` - Admin login
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/admin/refresh` - Admin refresh token
- `POST /auth/logout` - User logout
- `POST /auth/admin/logout` - Admin logout
- `GET /auth/google/login` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/microsoft/login` - Microsoft OAuth login
- `GET /auth/microsoft/callback` - Microsoft OAuth callback
- `POST /auth/change-password` - Change password
- `POST /auth/send-verification-email` - Send verification email
- `POST /auth/forget-password` - Password reset request
- `POST /auth/validate-otpCode` - Validate OTP code

### User Management (`/user`)

- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID
- `POST /user` - Create user
- `PATCH /user/:id` - Update user
- `DELETE /user/:id` - Delete user

### Patient Management (`/patient`)

- `GET /patient` - Get all patients
- `GET /patient/:id` - Get patient by ID
- `POST /patient` - Create patient
- `PATCH /patient/:id` - Update patient
- `DELETE /patient/:id` - Delete patient

### Patient Care Reports (`/patient-care-report`)

- `GET /patient-care-report` - Get reports from last 24 hours
- `GET /patient-care-report/:id` - Get specific report
- `POST /patient-care-report` - Create new report
- `PATCH /patient-care-report/:id` - Update report
- `DELETE /patient-care-report/:id` - Delete report
- `GET /patient-care-report/manage` - Admin: Get all reports
- `GET /patient-care-report/manage/stats` - Get report statistics

### Run Reports (`/run-report`)

- `GET /run-report` - Get all run reports
- `GET /run-report/:id` - Get run report by ID
- `POST /run-report` - Create run report
- `PATCH /run-report/:id` - Update run report
- `DELETE /run-report/:id` - Delete run report

### Equipment & Items (`/item`)

- `GET /item` - Get all items
- `POST /item/medication` - Create medication
- `POST /item/equipment` - Create equipment
- `GET /item/medication/:id` - Get medication by ID
- `GET /item/equipment/:id` - Get equipment by ID
- `PATCH /item/:id` - Update item
- `DELETE /item/:id` - Delete item

### Orders (`/order`)

- `GET /order` - Get all orders
- `GET /order/:id` - Get order by ID
- `POST /order` - Create order
- `PATCH /order/:id` - Update order
- `DELETE /order/:id` - Delete order

### Suppliers (`/supplier`)

- `GET /supplier` - Get all suppliers
- `GET /supplier/:id` - Get supplier by ID
- `POST /supplier` - Create supplier
- `PATCH /supplier/:id` - Update supplier
- `DELETE /supplier/:id` - Delete supplier

### Administrator (`/administrator`)

- `POST /administrator/signup` - Create admin account
- `GET /administrator/users` - Get all users (admin only)
- `PATCH /administrator/users/:id` - Update user (admin only)
- `DELETE /administrator/users/:id` - Delete user (admin only)
- `POST /administrator/database` - Create database (admin only)

### Database Monitoring (`/database-monitor`)

- `GET /database-monitor/metrics` - Get database metrics
- `GET /database-monitor/metrics/:hospitalId` - Get hospital-specific metrics
- `GET /database-monitor/utilization` - Get pool utilization
- `GET /database-monitor/utilization/:hospitalId` - Get hospital-specific utilization

## 📚 API Documentation

### Authentication Service

```typescript
// Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Register
POST /auth/signup
{
  "email": "user@example.com",
  "password": "password",
  "firstName": "John",
  "lastName": "Doe",
  "role": "EMPLOYEE"
}
```

### Patient Care Reporting

```typescript
// Create PCR
POST /patient-care-report
{
  "patientInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  },
  "incidentInfo": {
    "incidentType": "medical_emergency",
    "location": "123 Main St",
    "incidentTime": "2024-01-01T10:00:00Z"
  },
  "vitalSigns": {
    "bloodPressure": "120/80",
    "heartRate": 72,
    "temperature": 98.6
  }
}
```

### Inventory Management

```typescript
// Create Equipment
POST /item/equipment
{
  "name": "Defibrillator",
  "model": "AED-2000",
  "serialNumber": "DEF001",
  "status": "available",
  "location": "Ambulance-1"
}

// Create Medication
POST /item/medication
{
  "name": "Aspirin",
  "dosage": "81mg",
  "quantity": 100,
  "expiryDate": "2025-12-31",
  "supplier": "PharmaCorp"
}
```

## 🔒 Security

### Security Features

- **JWT token-based authentication** with refresh tokens
- **Secure password hashing** with Argon2
- **Input validation and sanitization** with class-validator
- **HTTPS enforcement** in production
- **Token refresh mechanism** for continuous sessions
- **Role-based access control** (RBAC)
- **CORS protection** with configurable origins
- **OAuth 2.0 integration** for secure third-party authentication
- **Email verification** system with OTP
- **Rate limiting** (configurable)

### Security Best Practices

- All API endpoints use HTTPS in production
- JWT tokens are stored securely with expiration
- Input validation on all request bodies
- Error handling without exposing sensitive information
- Regular dependency updates for security patches
- Secure file upload handling with validation
- Database connection pooling for performance and security
- Multi-tenant architecture for data isolation

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**

```bash
git checkout -b feature/amazing-feature
```

3. **Install dependencies**

```bash
npm install
```

4. **Make your changes**
5. **Run linting**

```bash
npm run lint
```

6. **Run tests**

```bash
npm run test
```

7. **Commit your changes**

```bash
git commit -m 'Add some amazing feature'
```

8. **Push to the branch**

```bash
git push origin feature/amazing-feature
```

9. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Ensure all linting passes
- Use conventional commit messages

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use NestJS decorators and patterns
- Implement proper error handling
- Write meaningful class and method names
- Use dependency injection for services

## 👨‍💻 Authors

**Rescue Track Development Team**

### Team Members

- **Project Manager & Lead Developer** - [@Hassan Mahadjir](https://github.com/hassan-mahadjir)

  - **Backend Development:**
    - NestJS API architecture and implementation
    - Multi-tenant database design with TypeORM
    - JWT authentication with refresh tokens
    - OAuth integration (Google & Microsoft)
    - Role-based access control (RBAC)
    - Patient Care Reporting (PCR) system
    - Inventory management (equipment & medication)
    - Email service integration with Nodemailer
    - Database monitoring and connection pooling
    - Hospital context middleware
    - API documentation and testing
    - Docker containerization
    - Production deployment configuration
  - **System Architecture:**
    - Database schema design and optimization
    - Multi-database connection management
    - Security implementation and best practices
    - Performance optimization and monitoring
    - Error handling and logging systems
  - **Project Management:**
    - Project planning and documentation
    - Code review and quality assurance
    - Team coordination and development workflow
    - Technical decision making and architecture planning

### Contact Information

- **Email**: hm.mahadjir@gmail.com
- **Project Repository**: [Rescue Track Backend](https://github.com/hassan-mahadjir/rescue-track-backend)
- **Frontend Repository**: [Rescue Track Frontend](https://github.com/hassan-mahadjir/rescue-track-frontend)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**NestJS License:**  
NestJS is licensed under the [MIT License](https://github.com/nestjs/nest/blob/master/LICENSE).

## 🙏 Acknowledgments

- **NestJS Team** for the amazing Node.js framework
- **TypeORM Team** for excellent database management
- **Passport.js Team** for authentication middleware
- **PostgreSQL Team** for the robust database system
- **All contributors** and maintainers
- **Emergency Services Community** for domain expertise

---

**Made with ❤️ for better emergency care**

_This project was developed to improve patient care reporting and emergency service management, demonstrating modern backend development practices and real-world problem-solving skills._
