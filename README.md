# 📰 News Aggregator API

A production-ready RESTful API for a personalized news aggregation platform built using **Node.js, Express, MongoDB, and JWT authentication**.

This API allows users to:

* Register and authenticate securely
* Set personalized news preferences
* Fetch news based on interests
* Mark articles as read or favorite
* Experience optimized performance with caching and rate limiting

---

# 🚀 Features

### 🔐 Authentication & Security

* User Registration & Login
* Password hashing using bcrypt
* JWT-based authentication
* Protected routes with middleware
* Helmet for security headers
* Rate limiting for API protection

---

### 📰 News Aggregation

* Fetch news based on user preferences
* Top headlines endpoint
* Keyword-based search
* Pagination support
* External API integration (NewsAPI)

---

### ⚙️ Advanced Backend Features

* MVC architecture
* Modular and scalable codebase
* Global error handling
* Custom middleware (logger, validator, auth)
* In-memory caching with TTL
* Background cache updater (cron job)

---

### ⭐ Article Management

* Mark articles as **read**
* Mark articles as **favorite**
* Fetch read and favorite articles

---

# 🏗️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT
* **Security:** Helmet, Rate Limiter
* **HTTP Client:** Axios
* **Testing:** Tap, Supertest

---

# 📁 Project Structure

```
src/
├── config/
│   ├── db.js
│   └── newsApi.js
├── controllers/
├── jobs/
├── middleware/
├── models/
├── routes/
├── services/
└── utils/
```

---

# ⚙️ Environment Variables

Create a `.env` file using the following:

```
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_jwt_secret_minimum_32_chars
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
NEWS_API_KEY=your_api_key
NEWS_API_BASE_URL=https://newsapi.org/v2
```

---

# 🛠️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/airtribe-projects/news-aggregator-api-vikash-sharma70-1.git
cd news-aggregator-api-vikash-sharma70-1
```

### 2. Install dependencies

```
npm install
```

### 3. Setup environment variables

```
cp .env.example .env
```

Update `.env` with your credentials.

### 4. Start the server

```
npm run dev
```

Server will run at:

```
http://localhost:3000
```

Health check:

```
GET /health
```

---

# 🔑 API Endpoints

## 🔐 Auth Routes

### Register User

```
POST /api/auth/register
```

### Login User

```
POST /api/auth/login
```

---

## 👤 Preferences

### Get Preferences

```
GET /api/preferences
```

### Update Preferences

```
PUT /api/preferences
```

---

## 📰 News

### Get News

```
GET /api/news
```

### Top Headlines

```
GET /api/news/top-headlines
```

### Search News

```
GET /api/news/search/:keyword
```

---

## ⭐ Articles

### Mark as Read

```
POST /api/news/:id/read
```

### Mark as Favorite

```
POST /api/news/:id/favorite
```

### Get Read Articles

```
GET /api/news/read
```

### Get Favorite Articles

```
GET /api/news/favorites
```

---

# 🔐 Authentication Usage

For protected routes, pass JWT token in headers:

```
Authorization: Bearer <your_token>
```

---

# ⚡ Caching Strategy

* In-memory caching implemented
* TTL-based expiration
* Cache used for:

  * News fetching
  * Top headlines
  * Search results

---

# 🧪 Running Tests

```
npm test
```

---

# 🧠 Design Principles

* Separation of concerns (MVC)
* DRY (Don't Repeat Yourself)
* Clean code practices
* Scalable folder structure
* Centralized error handling

---

# 📌 Future Improvements

* Redis caching
* WebSockets for real-time updates
* AI-based recommendation system
* Multi-source news aggregation
* Docker containerization

---

# 👨‍💻 Author

**Vikash Sharma**
Backend Developer

---

---

# 🌟 Final Note

This project demonstrates production-level backend engineering practices including authentication, API design, caching, and modular architecture.

If you found this useful, feel free to ⭐ the repository!
