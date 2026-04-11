import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import CategoryPage from './pages/CategoryPage';
import AllTools from './pages/AllTools';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Dashboard from './pages/Dashboard';
import DashboardSettings from './pages/DashboardSettings';
import ProtectedRoute from './components/ProtectedRoute';

// Legal Pages
import About from './pages/legal/About';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Contact from './pages/legal/Contact';
import Disclaimer from './pages/legal/Disclaimer';
import TermsAndConditions from './pages/legal/TermsAndConditions';
import CookiePolicy from './pages/legal/CookiePolicy';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tool/:slug" element={<ToolPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/all-tools" element={<AllTools />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}
