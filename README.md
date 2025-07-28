# 🍽️ EventRecipe

> Organize your culinary events with perfect recipes

A modern web application that helps users discover thousands of recipes and organize them into custom events for dinner parties, holidays, and special occasions.

## 🌐 Live Demo

**[Visit EventRecipe](https://event-recipe.vercel.app/)**

## ✨ Features

- **🔍 Recipe Discovery**: Browse thousands of recipes from TheMealDB API
- **📅 Event Organization**: Create and manage custom culinary events
- **🔐 Secure Authentication**: Google OAuth integration with Firebase
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **🛡️ Protected Routes**: Secure access to user-specific features
- **⚡ Real-time Data**: Dynamic recipe search and filtering
- **🎨 Modern UI**: Clean, intuitive interface built with Bootstrap

## 🛠️ Technologies Used

### Frontend

- **React 18** - Modern React with Hooks and Context API
- **React Router DOM** - Client-side routing and navigation
- **React Bootstrap** - Responsive UI components
- **Vite** - Fast build tool and development server

### Backend & Services

- **Firebase Authentication** - User authentication and management
- **TheMealDB API** - Recipe data and search functionality
- **Vercel** - Deployment and hosting platform

### Development Tools

- **Git & GitHub** - Version control and code collaboration
- **ESLint** - Code linting and formatting
- **npm** - Package management

## 📖 Usage

### For New Users

1. **Sign Up**: Create an account using Google OAuth
2. **Explore Recipes**: Browse the recipe collection from the home page
3. **Create Events**: Organize recipes into custom events
4. **Manage Events**: Add, remove, and organize your menu items

## 🔐 Authentication Flow

1. **Public Routes**: `/`, `/login`, `/signup` - Accessible to all users
2. **Protected Routes**: `/home`, `/events`, `/recipes` - Requires authentication
3. **Auto-redirect**: Non-authenticated users are redirected to login
4. **Persistent Sessions**: Users stay logged in across browser sessions

## 🌟 Key Features Deep Dive

### Recipe Discovery

- Integration with TheMealDB API for comprehensive recipe database
- Search functionality by recipe name, ingredient, or category
- Detailed recipe information including ingredients and instructions

### Event Management

- Create custom events for different occasions
- Add multiple recipes to each event
- Organize and manage event menus
- User-specific event storage

### Security & Authentication

- Firebase Authentication integration
- Google OAuth for seamless sign-in
- Protected routes with automatic redirects
- Secure user data management

## 🚀 Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

## 👤 Author

**Phin Shen Chin**

- GitHub: [@phinshen](https://github.com/phinshen)
- LinkedIn: [Phin Shen Chin](https://www.linkedin.com/in/phin-shen-chin-96290b244/)

## 🙏 Acknowledgments

- [TheMealDB](https://www.themealdb.com/) for providing the recipe API
- [Firebase](https://firebase.google.com/) for authentication services
- [React Bootstrap](https://react-bootstrap.github.io/) for UI components
- [Vercel](https://vercel.com/) for hosting and deployment

---

⭐ **If you found this project helpful, please give it a star!** ⭐
