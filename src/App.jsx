import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';

// Existing Public Portfolio Components
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import TechnicalSkills from './components/TechnicalSkills';
import Services from './components/Services';
import Projects from './components/Projects';
import ContentCreator from './components/ContentCreator';
import Internships from './components/Internships';
import Leadership from './components/Leadership';
import Certificates from './components/Certificates';
import SoftSkills from './components/SoftSkills';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Admin Components & Pages
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminSkills from './pages/admin/AdminSkills';
import AdminAbout from './pages/admin/AdminAbout';
import AdminExperience from './pages/admin/AdminExperience';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminResume from './pages/admin/AdminResume';
import AdminSettings from './pages/admin/AdminSettings';

const PublicPortfolio = () => (
  <>
    <Preloader />
    <Navbar />
    <Hero />
    <About />
    <TechnicalSkills />
    <Services />
    <Projects />
    <ContentCreator />
    <Internships />
    <Leadership />
    <Certificates />
    <SoftSkills />
    <Contact />
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio Route - Design and Layout completely preserved */}
            <Route path="/" element={<PublicPortfolio />} />

            {/* Admin Authentication Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Console Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="certificates" element={<AdminCertificates />} />
                <Route path="resume" element={<AdminResume />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;
