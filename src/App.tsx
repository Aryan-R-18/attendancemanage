import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAttendanceStore } from './store/attendanceStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SectionsPage from './pages/SectionsPage';
import AttendancePage from './pages/AttendancePage';
import ReportsPage from './pages/ReportsPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  const isAuthenticated = useAttendanceStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route 
            index 
            element={isAuthenticated ? <Navigate to="/sections" replace /> : <LoginPage />} 
          />
          <Route
            path="/sections"
            element={isAuthenticated ? <SectionsPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/attendance"
            element={isAuthenticated ? <AttendancePage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/reports"
            element={isAuthenticated ? <ReportsPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/history"
            element={isAuthenticated ? <HistoryPage /> : <Navigate to="/" replace />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;