# 💪 Fitness Tracker

A full-stack fitness tracking application built with React and Vercel serverless functions that allows users to log their workouts and track their progress over time.

## 🚀 **Simple Deployment: GitHub + Vercel + MongoDB Only!**

This application uses **Vercel's serverless functions** instead of a separate backend, making deployment incredibly simple with just three services.

## ✨ Features

- **User Authentication**: Register and login with JWT tokens
- **Workout Management**: Add, edit, delete, and complete workouts
- **Progress Tracking**: Track workout duration, date, and status
- **Responsive Design**: Modern UI with Bootstrap components
- **Real-time Updates**: Instant feedback with notifications
- **User Isolation**: Users can only access their own workouts

## 🛠️ Tech Stack

### Frontend
- React 19.1.1
- React Bootstrap 2.10.10
- React Router DOM 7.9.1
- Notyf (notifications)

### Backend (Serverless Functions)
- Vercel API Routes
- MongoDB with native driver
- JWT Authentication
- bcryptjs for password hashing

## 📁 Project Structure

```
fitness-tracker/
├── fitness-app-client/          # Main application
│   ├── api/                     # Serverless functions (backend)
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── register.js
│   │   │   ├── login.js
│   │   │   └── verify.js
│   │   └── workouts/            # Workout endpoints
│   │       ├── add.js
│   │       ├── get.js
│   │       ├── update.js
│   │       ├── delete.js
│   │       └── complete.js
│   ├── src/                     # React frontend
│   │   ├── components/          # Reusable components
│   │   │   ├── AppNavbar.js
│   │   │   ├── AddWorkoutModal.js
│   │   │   └── EditWorkoutModal.js
│   │   ├── pages/               # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Workouts.js
│   │   │   └── Error.js
│   │   ├── context/             # React context
│   │   │   └── UserContext.js
│   │   ├── config/              # Configuration
│   │   │   └── api.js
│   │   └── App.js
│   ├── vercel.json              # Vercel configuration
│   └── package.json
├── README.md
├── VERCEL_DEPLOYMENT.md          # Detailed deployment guide
└── DEPLOYMENT_CHECKLIST.md       # Deployment checklist
```

## 🚀 Quick Deployment

### Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free)

### Step-by-Step Deployment

1. **Set up MongoDB Atlas**
   ```bash
   # Create free MongoDB Atlas account
   # Create cluster
   # Set network access to 0.0.0.0/0 (allow all IPs)
   # Get connection string
   ```

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Fitness Tracker"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - **Set Environment Variables:**
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Any strong random string
     - `MONGODB_DB`: `fitness-tracker`
   - Deploy!

## 📱 Usage

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Add Workouts**: Click "Add Workout" to log new workouts
4. **Manage Workouts**: Edit, delete, or mark workouts as completed
5. **Track Progress**: View all your workouts with status and dates

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Workouts
- `POST /api/workouts/add` - Add a new workout (protected)
- `GET /api/workouts/get` - Get user's workouts (protected)
- `PATCH /api/workouts/update?id=123` - Update workout (protected)
- `DELETE /api/workouts/delete?id=123` - Delete workout (protected)
- `PATCH /api/workouts/complete?id=123` - Complete workout (protected)

## 🎨 UI Components

- **Home Page**: Landing page with feature overview
- **Login/Register**: Authentication forms
- **Workouts Page**: Main dashboard with workout cards
- **Add Workout Modal**: Form to add new workouts
- **Edit Workout Modal**: Form to edit existing workouts
- **Navigation Bar**: App navigation with user controls

## 🔧 Environment Variables

```bash
# Required for Vercel deployment
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker
JWT_SECRET=your-super-secret-jwt-key
MONGODB_DB=fitness-tracker
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- User-specific data access
- Protected API endpoints
- CORS handled by Vercel

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  isAdmin: Boolean,
  createdAt: Date
}
```

### Workouts Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  name: String,
  duration: String,
  status: String ('pending' | 'completed'),
  dateAdded: Date
}
```

## ✅ Benefits of This Architecture

1. **Single Platform**: Everything runs on Vercel
2. **No Separate Backend**: Serverless functions handle API
3. **Automatic Scaling**: Vercel handles scaling
4. **Cost Effective**: Free tier covers most needs
5. **Simpler Deployment**: One deployment process
6. **Better Performance**: Edge functions closer to users
7. **Easier Maintenance**: Single codebase

## 🧪 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# The app will run on http://localhost:3000
# API routes will be available at http://localhost:3000/api/*
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure all required environment variables are set in Vercel
   - Check variable names (case-sensitive)

2. **MongoDB Connection Issues**
   - Verify MongoDB Atlas network access is set to `0.0.0.0/0`
   - Check connection string format

3. **Build Failures**
   - Check for TypeScript/ESLint errors
   - Ensure all dependencies are in package.json

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🎯 Future Enhancements

- [ ] Workout categories and types
- [ ] Progress charts and analytics
- [ ] Social features and sharing
- [ ] Mobile app with React Native
- [ ] Workout templates and routines
- [ ] Goal setting and tracking
- [ ] Integration with fitness devices

## 🎉 Ready to Deploy!

Your fitness tracker is now ready for deployment with:
- ✅ GitHub repository
- ✅ Vercel hosting
- ✅ MongoDB Atlas database
- ✅ All features working
- ✅ Production-ready code

**Deploy and start tracking those workouts! 💪**

---

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
