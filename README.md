# 📦 POS-Inventory
### Modern Inventory & POS Management System (Frontend + Backend in One Monorepo)

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Angular-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MySQL-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Responsive-YES-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Architecture-Monorepo-yellow?style=for-the-badge" />
</p>

---

## 📌 Overview

**POS-Inventory** is a full-stack inventory and point-of-sale system built with a **dedicated Angular frontend** and a **Node.js (Express) backend**, organized together inside a single monorepo.

The system allows businesses to efficiently manage:

- Products  
- Stock Levels  
- Categories  
- Sales / POS Billing  
- Purchase Records  
- Admin Dashboard Analytics  

The frontend and backend communicate through REST APIs and share a clean, professional folder structure.

---

This repository contains:

/frontend  → Angular Application  

/backend   → Spring Boot REST API  

## 🧩 Features
🔹 Inventory Management

Add / update / delete products

Track stock levels

Manage product categories

🔹 POS System

Billing interface

Real-time stock deduction

Discount & tax support

🔹 Admin Dashboard

Track daily sales

View product analytics

Summary cards & charts

🔹 User Management

Role-based access (Admin / Staff)

Secure login with JWT

🔹 Tech Highlights

Angular responsive UI

Spring Boot REST API

MySQL database

Clean folder structure

Monorepo setup for easy development

## 📂 Folder Structure

POS-Inventory/

├── frontend/        # Angular UI

│   ├── src/

│   ├── package.json

│   └── angular.json

│

└── backend/         # NodeJS

    ├── src/
    
    ├── index.js
    
    └── Controller


## 🚀 How to Run the Project

▶️ 1. Run Frontend (Angular)

cd frontend

npm install

ng serve -o

Runs at: http://localhost:4200

▶️ 2. Run Backend (Nodejs)
cd backend
nodemon

API runs at: http://localhost:8080

## 🔧 API Integration

The Angular client connects to the Spring Boot API for:

Products

Categories

Stock Management

Sales / POS

Auth (JWT)

You can configure API URL in Angular:

/frontend/src/environments/environment.ts

apiUrl: 'http://localhost:8080/api'

## 📄 License

This project is for educational and development use.

## 👤 Developer

Muzamil Saleem  
Full Stack Developer
