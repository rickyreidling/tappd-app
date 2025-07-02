import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SignupForm, LoginForm, VerifyEmail, ProtectedRoute } from './components';

// Your existing components
import MainApp from './components/MainApp';
import UpgradePage from './components/UpgradePage'; // ✅ Make sure this path is correct

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* ✅ Upgrade Page (optional: protect it) */}
          <Route
            path="/upgrade"
            element={
              <ProtectedRoute>
                <UpgradePage />
              </ProtectedRoute>
            }
          />

          {/* Main App */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
