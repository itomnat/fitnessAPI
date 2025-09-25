# Fitness Tracker App

A modern, responsive fitness tracking application built with React that allows users to log workouts and track their progress over time.

## Features

- **User Authentication**: Register and login with email and password
- **Workout Management**: Add, view, edit, delete, and complete workouts
- **Progress Tracking**: Track workout status and date added
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with Bootstrap components

## Tech Stack

- **Frontend**: React 19, React Router DOM, React Bootstrap
- **Styling**: Bootstrap 5, Custom CSS
- **Notifications**: Notyf
- **State Management**: React Context API
- **API**: RESTful API integration

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fitness-tracker-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
# Create .env file in the root directory
REACT_APP_API_URL=https://fitnessapp-api-ln8u.onrender.com
```

4. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable components
│   └── AppNavbar.js     # Navigation bar
├── config/              # Configuration files
│   └── api.js           # API base URL configuration
├── context/             # React Context
│   └── UserContext.js   # User state management
├── pages/               # Page components
│   ├── Home.js          # Landing page
│   ├── Login.js         # Login page
│   ├── Register.js      # Registration page
│   └── Workouts.js      # Workouts management page
├── App.js               # Main app component
├── App.css              # Global styles
└── index.js             # App entry point
```

## API Endpoints

The app integrates with the following API endpoints:

- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/details` - Get user details
- `POST /workouts/addWorkout` - Add new workout
- `GET /workouts/getMyWorkouts` - Get user's workouts
- `PATCH /workouts/updateWorkout/:id` - Update workout
- `DELETE /workouts/deleteWorkout/:id` - Delete workout
- `PATCH /workouts/completeWorkoutStatus/:id` - Mark workout as complete

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL`: Your API base URL
4. Deploy!

### GitHub Pages Deployment

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add deployment script to package.json:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

3. Deploy:
```bash
npm run deploy
```

## Usage

1. **Register**: Create a new account with email and password
2. **Login**: Sign in to access your workouts
3. **Add Workouts**: Click "Add Workout" to create new workout entries
4. **Manage Workouts**: Edit, delete, or mark workouts as complete
5. **Track Progress**: View your workout history and completion status

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.