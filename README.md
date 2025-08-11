# Rescue Track - Emergency Medical Services Backend

A comprehensive NestJS backend application for emergency medical services management, featuring multi-tenant architecture, patient care reporting, and hospital management systems.

> This project was generated with [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.

## 👨‍💻 Author

**Created by:** Hassan Mahadjir  
**GitHub:** [@hassan-mahadjir](https://github.com/hassan-mahadjir)  
**Email:** hm.mahadjir@gmail.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

**NestJS License:**  
NestJS is licensed under the [MIT License](https://github.com/nestjs/nest/blob/master/LICENSE).

## 🚀 Features

### 🔐 Authentication & Authorization

- **Multi-Provider OAuth**: Google and Microsoft OAuth integration
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control**: Admin, Doctor, Nurse, and Employee roles
- **Password Management**: Secure password hashing with Argon2, password reset functionality
- **Email Verification**: OTP-based email verification system

### 🏥 Hospital Management

- **Multi-Tenant Architecture**: Separate database connections for different hospitals
- **Hospital Context Middleware**: Automatic hospital context management
- **User Management**: Complete user lifecycle management with profiles
- **Administrator Panel**: Dedicated admin interface for system management

### 👥 Patient Care System

- **Patient Management**: Complete patient records and information
- **Patient Care Reports**: Comprehensive medical reporting system
- **Vital Signs Tracking**: Real-time vital signs monitoring and recording
- **Medical Conditions**: Patient medical history and conditions
- **Allergies Management**: Patient allergy tracking and alerts
- **Treatment Records**: Detailed treatment documentation
- **Physical Assessment**: Pupil, respiratory, and skin assessments
- **Trauma Documentation**: Injury mechanism and trauma records
- **Special Circumstances**: Special medical circumstances tracking

### 🚑 Emergency Response

- **Run Reports**: Emergency response and dispatch management
- **Equipment Management**: Medical equipment tracking and maintenance
- **Medication Management**: Medication inventory and tracking
- **Supplier Management**: Vendor and supplier relationship management
- **Order Management**: Purchase orders and inventory management

### 📊 Monitoring & Analytics

- **Database Monitoring**: Connection pool monitoring and metrics
- **Report Statistics**: Comprehensive reporting and analytics
- **Performance Metrics**: System performance monitoring

### 📧 Communication

- **Email Services**: Automated email notifications and alerts
- **Verification System**: Email verification and password reset

## 🛠 Tech Stack

### Backend Framework

- **NestJS** - Progressive Node.js framework for building scalable server-side applications
- **TypeScript** - Type-safe JavaScript development
- **Node.js** - JavaScript runtime environment

### Database & ORM

- **TypeORM** - Object-Relational Mapping for TypeScript and JavaScript
- **PostgreSQL** - Primary database system
- **Supabase** - Database hosting and management

### Authentication & Security

- **Passport.js** - Authentication middleware for Node.js
- **JWT** - JSON Web Tokens for secure authentication
- **Argon2** - Password hashing algorithm
- **bcrypt** - Password hashing library

### OAuth Providers

- **Google OAuth 2.0** - Google authentication integration
- **Microsoft OAuth** - Microsoft authentication integration

### Email Services

- **Nodemailer** - Email sending library
- **Gmail SMTP** - Email service provider

### Development Tools

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatter
- **Jest** - Testing framework
- **Docker** - Containerization

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database
- Docker (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
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

4. **Start the application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## 📡 API Endpoints

### Authentication (`/auth`)

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/admin/login` - Admin login
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/google/login` - Google OAuth login
- `GET /auth/microsoft/login` - Microsoft OAuth login

### User Management (`/user`)

- `GET /user` - Get all users
- `POST /user` - Create user
- `PATCH /user/:id` - Update user
- `DELETE /user/:id` - Delete user

### Patient Management (`/patient`)

- `GET /patient` - Get all patients
- `POST /patient` - Create patient
- `PATCH /patient/:id` - Update patient
- `DELETE /patient/:id` - Delete patient

### Patient Care Reports (`/patient-care-report`)

- `GET /patient-care-report` - Get reports from last 24 hours
- `POST /patient-care-report` - Create new report
- `PATCH /patient-care-report/:id` - Update report
- `GET /patient-care-report/manage/stats` - Get report statistics

### Run Reports (`/run-report`)

- `GET /run-report` - Get all run reports
- `POST /run-report` - Create run report
- `PATCH /run-report/:id` - Update run report

### Equipment & Items (`/item`)

- `GET /item` - Get all items
- `POST /item/medication` - Create medication
- `POST /item/equipment` - Create equipment
- `PATCH /item/:id` - Update item

### Orders (`/order`)

- `GET /order` - Get all orders
- `POST /order` - Create order
- `PATCH /order/:id` - Update order

### Suppliers (`/supplier`)

- `GET /supplier` - Get all suppliers
- `POST /supplier` - Create supplier
- `PATCH /supplier/:id` - Update supplier

### Administrator (`/administrator`)

- `POST /administrator/signup` - Create admin account
- `GET /administrator/users` - Get all users (admin only)

### Database Monitoring (`/database-monitor`)

- `GET /database-monitor/metrics` - Get database metrics
- `GET /database-monitor/utilization` - Get pool utilization

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Scripts

- `npm run build` - Build the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **Password hashing** with Argon2
- **CORS protection**
- **Input validation** with class-validator
- **OAuth 2.0 integration** for secure third-party authentication
- **Email verification** system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

**NestJS License:**  
NestJS is licensed under the [MIT License](https://github.com/nestjs/nest/blob/master/LICENSE).

---

**Rescue Track** - Empowering Emergency Medical Services with Advanced Technology
