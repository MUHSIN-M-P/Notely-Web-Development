<h1 align="center">
  <a href="#">
    📝 Notely
  </a>
</h1>

<p align="center">
  <strong>A full-featured note-taking and to-do list application built with React and Node.js</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue" />
  <img src="https://img.shields.io/badge/Node.js-Express-green" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

---

## ✨ Features

### Core Functionality

-   🔐 **Email-based Authentication** - Secure user registration and login
-   🎫 **JWT Token Authentication** - Stateless, secure session management
-   ✏️ **Rich Text Editor** - Create stylish notes with formatting options
-   ☑️ **Task Lists** - Integrated checkboxes for to-do functionality
-   ⏰ **Reminders** - Set date/time reminders on notes
-   🗑️ **Recycle Bin** - Recover deleted notes within 30 days
-   📌 **Pin Notes** - Keep important notes at the top
-   🎨 **Color Coding** - Organize notes with 7 color themes

### Advanced Features

-   👤 **User Profile Management** - Update username, email, password, and avatar
-   🔒 **Enhanced Security** - XSS protection, SQL injection prevention, input validation
-   📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
-   🎯 **RESTful API** - Clean, well-structured backend architecture
-   🗄️ **PostgreSQL Database** - Reliable data persistence with proper relationships

---

## 🛠️ Built With

### Frontend

-   **[React](https://react.dev)** - UI library for building interactive interfaces
-   **React Router DOM** - Client-side routing
-   **Quill.js** - Rich text editor
-   **Axios** - HTTP client for API requests
-   **React Icons** - Icon library

### Backend

-   **[Node.js](https://nodejs.org/)** - JavaScript runtime
-   **[Express](https://expressjs.com/)** - Web application framework
-   **[PostgreSQL](https://www.postgresql.org/)** - Relational database
-   **JWT** - JSON Web Tokens for authentication
-   **bcrypt** - Password hashing
-   **express-validator** - Input validation
-   **Helmet** - Security middleware

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   PostgreSQL (v12 or higher)
-   npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/MUHSIN-M-P/Notely-Web-Development.git
cd Notely-Web-Development
```

2. **Set up environment variables**

Create a `.env` file in the `server` directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/notely
ACCESS_TOKEN_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

3. **Install server dependencies**

```bash
cd server
npm install
```

4. **Install client dependencies**

```bash
cd ../client
npm install
```

5. **Set up the database**

```bash
cd ../server
node createTables.js
```

6. **Start the backend server** (Terminal 1)

```bash
cd server
npm start
```

Server will run on `http://localhost:5000`

7. **Start the frontend** (Terminal 2)

```bash
cd client
npm start
```

Client will run on `http://localhost:3000`

8. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

---

## 📚 API Documentation

### Authentication Endpoints

-   `POST /signup` - Register new user
-   `POST /login` - User login
-   `POST /logout` - User logout
-   `GET /auth/check-session` - Validate session

### Notes Endpoints

-   `GET /home` - Get all user notes
-   `POST /home/create-note` - Create new note
-   `PUT /home/edit/:id` - Update note
-   `DELETE /home/:id` - Move note to bin
-   `GET /home/pin` - Get pinned notes
-   `PUT /home/pin/:id` - Toggle pin status

### Additional Endpoints

-   `GET /home/reminders` - Get notes with reminders
-   `GET /home/bin` - Get deleted notes
-   `PUT /home/bin/:id` - Restore note
-   `DELETE /home/bin/:id` - Permanently delete
-   `GET /home/account` - Get user profile
-   `POST /home/update-account` - Update profile
-   `DELETE /home/delete-account` - Delete account

---


---

## 🔒 Security Features

-   **Password Hashing**: bcrypt with 10 salt rounds
-   **JWT Authentication**: Secure token-based auth with HTTP-only cookies
-   **Input Validation**: Server-side validation using express-validator
-   **XSS Protection**: Sanitization of user inputs
-   **SQL Injection Prevention**: Parameterized queries
-   **Security Headers**: Helmet.js implementation
-   **CORS Configuration**: Restricted cross-origin access

---

## 📱 Screenshots

_Add screenshots of your application here_

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

-   [Quill.js](https://quilljs.com/) - Rich text editor
-   [React](https://react.dev) - UI library
-   [PostgreSQL](https://www.postgresql.org/) - Database
-   All open-source contributors

---

<p align="center">Made with ❤️ by MUHSIN M P</p>
