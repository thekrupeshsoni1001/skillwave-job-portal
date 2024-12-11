import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/Home';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import Profile from './components/Profile';
import JobDescription from './components/JobDescription';
import Companies from './components/recruiters/Companies';
import CompanyCreate from './components/recruiters/CompanyCreate';
import CompanySetup from './components/recruiters/CompanySetup';
import RecruiterJobs from './components/recruiters/RecruiterJobs'; 
import PostJob from './components/recruiters/PostJob';
import Applicants from './components/recruiters/Applicants';
import ProtectedRoute from './components/recruiters/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard'; // Import AdminDashboard
import AdminSignup from './components/admin/AdminSignup'; // Import AdminSignup
import AdminLogin from './components/admin/AdminLogin'; // Import AdminLogin

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/description/:id',
    element: <JobDescription />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  // Updated Routes for recruiters
  {
    path: '/recruiters/companies',
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: '/recruiters/companies/create',
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: '/recruiters/companies/:id',
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: '/recruiters/jobs',
    element: <ProtectedRoute><RecruiterJobs /></ProtectedRoute>
  },
  {
    path: '/recruiters/jobs/create',
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: '/recruiters/jobs/:id/applicants',
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
  // Admin Routes
  {
    path: '/admin/signup',
    element: <AdminSignup />
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  // Admin Dashboard Route
  {
    path: '/admin/*', // Catch all admin routes
    element: <AdminDashboard />
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
