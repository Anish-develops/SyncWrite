import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { JoinProject } from './pages/JoinProject';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--surface-raised)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            fontSize: '12px',
            fontFamily: '"Instrument Sans", system-ui, sans-serif',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent-primary)',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join/:inviteCode" element={<JoinProject />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<Editor />} />
        </Route>

        {/* Fallback */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
