import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Gemini31Pro from './pages/Gemini31Pro.jsx';
import Generator from './pages/Generator.jsx';
import About from './pages/About.jsx';
import Articles from './pages/Articles.jsx';
import ProjectPreview from './pages/ProjectPreview.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import MiniMax2026 from './pages/MiniMax2026.jsx';

// 登录保护路由组件
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generator" element={<Generator />} />
      <Route path="/projects/:id" element={<ProjectPreview />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/posts/gemini-3-1-pro" element={<Gemini31Pro />} />
      <Route path="/posts/minimax-2026" element={<MiniMax2026 />} />
    </Routes>
  );
}
