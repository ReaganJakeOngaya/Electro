// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './Pages/LandingPage';
import Account from './Pages/Auth';
import UserDashboard from './Pages/UserDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import NotFound from './Pages/NotFound';
import { getUser, getToken } from './Components/common/utils/auth';
import AboutUs from './Pages/AboutUs';
import Support from './Pages/Support';

// Protected route wrapper
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = getToken();
  const user = getUser();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (requireAdmin && !user.is_admin) return <Navigate to="/user-dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Account />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/support" element={<Support />} />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute requireAdmin={false}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;