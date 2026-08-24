# Student Career Guidance & Admission Platform

A professional, full-stack web platform designed to empower students with senior-like career guidance, program exploration, career path discovery, and direct counsellor connections for seamless university/college admission.

---

## 🏗️ Project Architecture & Structure

- **Frontend**: React 18 + Vite (Responsive modern UI)
- **Backend**: Java 17 + Spring Boot 3.3.2 (REST APIs, Spring Data JPA, Spring Security, JavaMail)
- **Database**: MySQL 8.0 (`student_career_guidance`)

---

## 📁 Directory Structure

```text
.
├── frontend/                     # React + Vite Client Application
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── components/           # UI components
│   │   ├── pages/                # Views & navigation flow
│   │   ├── services/             # API client layer (api.js)
│   │   └── styles/               # CSS stylesheets
│   ├── package.json
│   └── vite.config.js
│
└── backend/                      # Spring Boot REST API Application
    ├── src/main/java/com/careerguidance/
    │   ├── controller/           # REST API Endpoints
    │   ├── service/              # Business logic layer
    │   ├── repository/           # JPA Repositories
    │   ├── entity/               # Database Entities
    │   ├── dto/                  # Request / Response DTOs
    │   └── config/               # Security & CORS configuration
    ├── src/main/resources/
    │   └── application.yml       # Database & Mail configuration
    ├── pom.xml
    └── mvnw.cmd
```

---

## 🚀 How to Run Locally

### Quick Start (Windows)
Run PowerShell script from root directory:
```powershell
.\start.ps1
```

### Manual Start

1. **MySQL Database**:
   - Ensure MySQL 8.0 service is running.
   - Database `student_career_guidance` is created automatically on startup.

2. **Backend (Spring Boot)**:
   ```bash
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
   Backend will start on: `http://localhost:8080`

3. **Frontend (React + Vite)**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will start on: `http://localhost:3000`

---

## 🌐 Deploy to GitHub

```bash
git add .
git commit -m "feat: complete student career guidance and admission platform"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```
