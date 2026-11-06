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
cd backend_sikap

npm install
```

Create a `.env` file for local development. Set `CORS_ORIGINS` to the exact
origin(s) where the frontend is hosted, separated by commas. The hosting
provider's `PORT` environment variable is used automatically; `3000` is the
local fallback.

```env
PORT=3000
NODE_ENV=development

HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=your_password
DATABASE_DEVELOPMENT=sikap_development
DATABASE_PRODUCTION=sikap_production

CORS_ORIGINS=http://localhost:5173,http://localhost:8080
```

In hosting, set `NODE_ENV=production`, the production database variables
(`HOST`, `DB_USERNAME`, `DB_PASSWORD`, and `DATABASE_PRODUCTION`), and
`CORS_ORIGINS` in the hosting control panel. Run database migrations with
`npm run migrate` after configuring the production environment.

Administrators can change the application clock from **Super Admin → Pengaturan
→ Jam Aplikasi**. Simulation starts from a WIB date and time and continues at
normal speed for all users; choose **Waktu sebenarnya** to turn it off. Apply
the database migrations after deploying this feature before starting the API.

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

Student roster management is available to administrators:

```
GET    /api/students?class_id=1
GET    /api/students/:id
POST   /api/students
GET    /api/students/import-template?level=X
POST   /api/students/import
PUT    /api/students/:id
DELETE /api/students/:id
```

Student records contain `name`, optional `nis`/`nisn` and `gender`, a required
`class_id`, and an `active`/`inactive` status. Deleting a student marks the
record inactive so it can be retained for attendance history.
Administrators can download a `.xlsx` workbook for each grade (`X`, `XI`, or
`XII`) from `/api/students/import-template?level=X`. Use the downloaded SIKAP
template for upload: each sheet name is generated from the existing `Classes`
table, and the first row must contain `nis`, `nisn`, `nama`, and `gender`.
Each sheet is mapped to its existing class record; importing students never
creates or renames classes. School attendance workbooks must first be copied
into the matching SIKAP template. Upload the workbook to
`/api/students/import` as multipart fields `file` and `level`. Duplicate
identifiers, sheet names that do not exactly match a class in the selected
grade, or invalid student rows reject the entire upload. Uploads are limited
to 5 MB and 2,000 students per grade upload.

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

<img width="1307" height="902" alt="image" src="https://github.com/user-attachments/assets/96bc0584-0e88-4a9f-b3ef-3be97e201ac7" />


---

## Author

Developed by **Ruly Abdul Rasyid**
