# 🏠 RealEstate - Property Management Platform

A full-stack real estate platform where buyers and sellers can connect, list properties, and chat in real-time. Built with modern web technologies.

## 🌐 Live Demo

- **Frontend:** https://realestate-five-liard.vercel.app/
- **Backend API:** https://realestatebackend-ua25.onrender.com

## ✨ Features

### 👤 For Sellers
- 📊 Dashboard to track property performance
- 🏠 Add, edit, and delete property listings
- 💬 Real-time chat with buyers
- 📈 Manage leads and inquiries
- ❤️ Save favorite properties

### 👤 For Buyers
- 🔍 Search and filter properties
- 💬 Direct chat with sellers
- ❤️ Bookmark favorite properties
- 📱 Full mobile support

### 🔧 General
- 🔐 Secure JWT authentication
- 👤 User profiles
- 📸 Multiple image uploads
- 🌐 Real-time updates with Socket.io
- 📱 Mobile-first responsive design

## 🛠️ Tech Stack

### Frontend
- React.js + Vite.js
- Material-UI (MUI)
- Tailwind CSS
- React Router DOM
- Axios
- Socket.io Client
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io
- Multer (File Upload)
- Bcrypt (Password Hashing)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---------Backend------------
cd backend
npm install

Create a .env file in backend folder:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/realestate
JWT_SECRET=your_secret_key_here
NODE_ENV=development

npm start

---------Frontend-------------
cd frontend
npm install

Create a .env file in backend folder:
VITE_API_URL=http://localhost:5000
