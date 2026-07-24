# 🛍️ ProductHub

> A modern and responsive e-commerce web application built with **React**, **Redux Toolkit**, and **Tailwind CSS** as a Frontend Developer Technical Assessment.  
> The application integrates with the **DummyJSON API** to provide authentication, product browsing, searching, filtering, sorting, shopping cart management, and unit testing.

---

## 🔗 Live Demo

🚧 Coming Soon



---

## 📂 GitHub Repository

https://github.com/Ahmedhanafy4199/producthub

---

# ✨ Features

## 🔐 Authentication

- Login using DummyJSON Authentication API
- User Registration
- JWT Token stored in localStorage
- Protected Routes
- Persistent authentication after page refresh

---

## 📦 Products

- Browse all products
- Responsive product grid
- Product details page
- Product image gallery
- Product ratings
- Stock availability
- Discount calculation
- Original & discounted prices

---

## 🔍 Search, Filter & Sorting

- Search products by **Title**
- Dynamic Category Filter
- Sort products by:
  - Default
  - Price (Low → High)
  - Price (High → Low)
  - Rating
  - Title (A → Z)
  - Title (Z → A)

---

## 🛒 Shopping Cart

- Add products to cart
- Remove products
- Increase quantity
- Decrease quantity
- Clear cart
- Persistent cart using localStorage
- Cart summary

---

## 🎨 UI / UX

- Responsive Design
- Mobile Navigation
- Dark / Light Theme
- Skeleton Loading
- Error Handling
- Toast Notifications
- Smooth UI Animations

---

## ⚡ Performance

- Redux Toolkit state management
- Debounced search
- Lazy API requests
- Optimized rendering
- Persistent local caching

---

# 🧪 Unit Testing

The project includes unit tests built using **Vitest** and **React Testing Library**.

### Tested Modules

- productsSlice
- authSlice
- cartSlice
- ProductCard
- CartPage

### Run Tests

```bash
npm run test
```

---

# 🛠️ Tech Stack

| Technology | Usage |
|------------|------|
| React | UI Library |
| Vite | Build Tool |
| Redux Toolkit | State Management |
| React Router | Routing |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Vitest | Unit Testing |
| React Testing Library | Component Testing |
| DummyJSON API | Backend API |

---

# 📁 Project Structure

```text
producthub/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   └── products/
│   │
│   ├── pages/
│   │
│   ├── services/
│   │
│   ├── store/
│   │
│   ├── tests/
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── ProductHub_API.postman_collection.json
├── package.json
├── vite.config.js
├── vitest.config.js
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- npm 9+

---

## Installation

Clone the repository

```bash
git clone https://github.com/Ahmedhanafy4199/producthub
```

Go to project folder

```bash
cd producthub
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Open

```
http://localhost:5173
```

---

# 📬 API Endpoints

Authentication

```
POST /auth/login
```

Products

```
GET /products
```

Search Products

```
GET /products/search?q={query}
```

Categories

```
GET /products/categories
```

Products By Category

```
GET /products/category/{category}
```

Single Product

```
GET /products/{id}
```

---

# 📮 Postman Collection

A complete Postman collection is included in the project root.

```
ProductHub_API.postman_collection.json
```

---

# ✅ Technical Task Coverage

| Requirement | Status |
|-------------|:------:|
| Authentication | ✅ |
| JWT Token | ✅ |
| Product List | ✅ |
| Responsive Cards | ✅ |
| Product Details | ✅ |
| Search by Title | ✅ |
| Category Filter | ✅ |
| Sorting | ✅ |
| Pagination | ✅ |
| Loading State | ✅ |
| Error Handling | ✅ |
| Responsive Design | ✅ |
| Component-Based Structure | ✅ |
| Clean Code | ✅ |
| Redux Toolkit | ✅ |
| Tailwind CSS | ✅ |
| Unit Testing | ✅ |
| Postman Collection | ✅ |

---

# 👨 Author

Ahmed Hanafy

GitHub

https://github.com/Ahmedhanafy4199

---

# 📄 License

This project was created for a Frontend Developer Technical Assessment.