# 🚀 RemoteSync

RemoteSync is a modern, full-stack web application designed to manage work rotations for teams—helping organizations easily track and assign which associates should be working on-site or remotely. It streamlines rotation scheduling, project assignments, and reporting, making it ideal for hybrid or distributed teams.

---

## ✨ Key Features
- 🗓️ **Rotation Management:** Assign and visualize who should be on-site or remote on any given day.
- 📁 **Project Tracking:** Manage projects, deadlines, and associate assignments.
- 📊 **Reporting:** Submit, review, and manage reports related to projects and rotations.
- 👥 **User Roles:** Supports multiple roles (Admin, Associate, RC, etc.) with role-based access control.
- 🔔 **Notifications:** Keep users up to date with relevant alerts.
- 💎 **Modern UI:** Responsive Angular frontend with PrimeNG components for a clean user experience.

---

## 🛠️ Technology Stack
- 💻 **Frontend:** Angular (TypeScript), PrimeNG
- 🔙 **Backend:** Java, Spring Boot, Maven
- 🗄️ **Database:** MySQL
- 🐳 **Containerization:** Docker Compose (for backend services)

---

## 🏗️ Architecture Overview
RemoteSync is split into two main applications:

- **api/** — Java Spring Boot REST API
  - Handles authentication, user management, project and rotation logic, reporting, and notifications.
  - Organized by layered architecture: `adapter` (controllers), `application` (services, DTOs), `domain` (entities, repositories), `infrastructure`, and `kernel`.
  - Uses DTOs, interceptors for logging, and role-based access.

- **app/** — Angular Frontend
  - Provides an interactive dashboard for users to view rotations, manage projects, and submit reports.
  - Modular structure: Dashboard, Projects, Reports, Calendar, Shared Navigation, etc.
  - Integrates with backend via RESTful API endpoints.

---

## ⚡ Quick Start

### 🐳 Backend (API)
1. **Requirements:** Java 17+, Maven
2. **Setup:**
   - Navigate to `api/`
   - Use Docker Compose to start the services:
     ```sh
     docker-compose up
     ```
   - Install dependencies and start the server:
     ```sh
     ./mvnw spring-boot:run
     ```

### 🌐 Frontend (App)
1. **Requirements:** Node.js 18+, Angular CLI
2. **Setup:**
   - Navigate to `app/`
   - Install dependencies:
     ```sh
     npm install
     ```
   - Start the development server:
     ```sh
     ng serve
     ```
   - The app will be available at `http://localhost:4200`

---

## 🧑‍💻 Example Usage
- 🏠 **Dashboard:** See at a glance which associates are scheduled for on-site or remote work.
- 📁 **Project Management:** Filter, search, and update project assignments.
- 📊 **Reports:** Submit and review daily or weekly rotation reports.

---

## 📂 Project Structure
```
RemoteSync/
├── api/       # Java Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   └── docker-compose.yml
├── app/       # Angular frontend
│   ├── src/
│   ├── package.json
│   └── angular.json
```

---