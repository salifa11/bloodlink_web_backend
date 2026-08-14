# 🩸 BloodLink — Backend

> A backend API for **BloodLink**, a web-based platform designed to make blood donation and donor management more accessible and efficient.

---

## 📌 About The Project

**BloodLink** is a web application focused on connecting people who need blood with potential blood donors.

This repository contains the **backend/server-side application** of BloodLink. It handles the application's APIs, authentication, user management, file uploads, and communication between the frontend and database.

The backend is designed using **Node.js and Express.js** with a modular structure for controllers, routes, middleware, and other server-side functionality.

---

## ✨ Features

* 🔐 User authentication and authorization
* 👤 User registration and login
* 🧑‍💻 User profile management
* 🩸 Blood donor-related functionality
* 🔄 REST API endpoints
* 📁 File/image upload support
* 🛡️ Authentication middleware
* 🔑 Password reset functionality
* 👤 Profile image management
* 🗄️ Backend data management
* 🌐 Frontend-backend API communication

---

## 🛠️ Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **JavaScript**
* **REST API**

### Tools & Packages

* **JWT** — Authentication
* **Multer** — File uploads
* **npm** — Package management
* **Git & GitHub** — Version control

---

## 📂 Project Structure

```text
bloodlink_web_backend/
│
├── src/
│   ├── controller/
│   ├── middleware/
│   ├── routes/
│   └── ...
│
├── uploads/
│
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/salifa11/bloodlink_web_backend.git
```

### 2. Navigate to the project

```bash
cd bloodlink_web_backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create your environment file

Create a `.env` file in the root directory.

```env
PORT=5000
MONGO_URI=your_database_connection
JWT_SECRET=your_secret_key
```

> ⚠️ Never upload your `.env` file or secret keys to GitHub.

### 5. Start the server

For development:

```bash
npm run dev
```

Or:

```bash
node index.js
```

The server should then run on:

```text
http://localhost:5000
```

---

## 🔐 Authentication

BloodLink uses token-based authentication to protect user-specific resources.

The backend provides functionality for:

* Registration
* Login
* Authentication verification
* Profile access
* Profile updates
* Password reset
* Account management

Protected routes require a valid authentication token.

---

## 📡 API Structure

The backend follows a REST API structure.

Example API operations include:

| Method   | Purpose                   |
| -------- | ------------------------- |
| `POST`   | Register / Login          |
| `GET`    | Retrieve user information |
| `PUT`    | Update user information   |
| `DELETE` | Delete user               |
| `POST`   | Upload profile image      |
| `POST`   | Forgot password           |
| `POST`   | Reset password            |

---

## 🖼️ File Uploads

The backend supports image/file uploads using **Multer**.

Uploaded files are handled through the server's upload functionality and can be used for user profile images and other supported resources.

---

## 🔗 Frontend

This backend is designed to work with the BloodLink frontend application.

**Frontend:** BloodLink Web

The frontend communicates with this backend through REST APIs.

---

## 🚀 Future Improvements

* 📍 Location-based donor matching
* 🔔 Real-time blood request notifications
* 🏥 Hospital integration
* 📊 Blood availability analytics
* 🤖 Blood demand prediction
* 📱 Mobile application
* ☁️ Cloud deployment
* 🔒 Further security improvements

---

## 🎯 Project Goals

BloodLink aims to make the process of finding blood donors **faster, simpler, and more accessible** while providing a structured platform for managing users and blood-related requests.

---

## 👩‍💻 Author

**Salifa Shrestha**

BSc (Hons) Computing Student
UI/UX Designer | Aspiring Data Analyst | Developer

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub!

---

<p align="center">
  🩸 <strong>BloodLink — Connecting Donors. Saving Lives.</strong> ❤️
</p>
