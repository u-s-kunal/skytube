# SkyTube

A full-stack video-sharing platform built with the MERN stack, featuring secure authentication, video uploads, content management, comments, likes, pagination, and cloud-based media storage.

## Live Demo

https://skytube-self.vercel.app

---

## Overview

SkyTube is a full-stack video-sharing application built to practice and demonstrate real-world MERN Stack development.

The application provides authenticated users with the ability to manage video content, interact with videos through likes and comments, and access content based on ownership and authorization rules.

The project includes a separate React frontend and Node.js/Express backend connected to MongoDB and Cloudinary.

---

## Features

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Access token and refresh token implementation
- HTTP cookie-based token handling
- Protected routes
- Refresh-token rotation
- User-specific authorization
- Ownership-based access control

### Video Management

- Upload videos through Cloudinary
- Store video metadata in MongoDB
- Video publishing status
- Video ownership
- Paginated video retrieval
- Authenticated video interactions

### Comments & Likes

- Add comments to videos
- Authenticated comment interactions
- Like videos
- Like comments
- User-specific access control

### Frontend

- React-based user interface
- Responsive design
- Reusable components
- API integration
- Authentication-aware UI
- Application state management

### Backend

- RESTful API architecture
- Express.js middleware
- Authentication middleware
- Controller-based architecture
- MongoDB/Mongoose integration
- Centralized error handling
- Environment-based configuration

---

## Tech Stack

### Frontend

- React.js
- JavaScript (ES6+)
- Tailwind CSS
- Redux
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cookie-based authentication

### Cloud & Deployment

- Cloudinary — Video/media storage
- MongoDB Atlas — Database
- Vercel — Frontend deployment
- Render — Backend deployment

### Development Tools

- Git
- GitHub
- Postman
- npm

---

## Application Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      Vercel         │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Express / Node.js  │
                    │       Render        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │  MongoDB   │   │ Cloudinary │   │    JWT     │
       │   Atlas    │   │   Media    │   │   Auth     │
       └────────────┘   └────────────┘   └────────────┘
