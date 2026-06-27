# SIKAP - Teacher Performance Information System

SIKAP (Sistem Informasi Kinerja dan Penilaian Guru) is a web-based application designed to manage teacher performance assessments, attendance records, and activity evaluations in schools.

The application aims to simplify the performance evaluation process by providing a centralized, transparent, and efficient system for teachers, principals, and other authorized personnel.

## Features

- Teacher Performance Assessment
- Attendance Management
- Teaching Activity Evaluation
- School Activity Attendance
- Dashboard & Statistics
- Role-Based Access Control
- Responsive User Interface
- RESTful API

---

## Technology Stack

### Frontend

- Vue.js
- Vue Router
- Bootstrap 5
- Axios

### Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL

---

## Project Structure

```
sikap/
│
├── backend/          # Express.js REST API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── ...
│
├── frontend/         # Vue.js Application
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-org/sikap.git
cd sikap
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=sikap
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
```

Run server

```bash
npm run dev
```

or

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Run development server

```bash
npm run serve
```

or (if using Vite)

```bash
npm run dev
```

---

## API

The backend provides RESTful APIs that are consumed by the Vue.js frontend.

Example:

```
GET    /api/teachers
POST   /api/auth/login
GET    /api/attendance
POST   /api/performance
```

---

## User Roles

- Administrator
- Principal
- Teacher
- Person in Charge (PIC)
- Class Teacher

Each role has different permissions based on the system requirements.

---

## Screenshots

Coming Soon

---

## Roadmap

- Authentication & Authorization
- Teacher Management
- Attendance Module
- Performance Assessment
- Dashboard Analytics
- Report Export (PDF/Excel)
- Notification System
- Mobile Friendly Interface

---

## Contributing

Contributions, issues, and feature requests are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## License

This project is intended for educational and institutional use.

---

## Author

Developed by **Ruly Abdul Rasyid**
