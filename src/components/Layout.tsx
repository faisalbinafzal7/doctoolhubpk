import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Github, Twitter, Mail, FileText, Settings } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuthButton } from './Auth';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Tools', path: '/all-tools' },
    { name: 'Text Tools', path: '/category/text-tools' },
    { name: 'PDF Tools', path: '/category/pdf-tools' },
    { name: 'Dev Tools', path: '/category/developer-tools' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-white border-2 border-sky-500 rounded-lg flex items-center justify-center text-sky-500 transition-transform group-hover:scale-105">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-sky-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                    <Settings className="w-3 h-3 animate-spin-slow" style={{ animationDuration: '8s' }} />
                  </div>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-black text-slate-900 tracking-tight">
                    DocToo
                  </span>
                  <span className="text-xl font-black text-sky-500 tracking-tight">
                    lHub
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-bold transition-colors hover:text-sky-500",
                    location.pathname === link.path ? "text-sky-500" : "text-slate-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Link 
                to="/all-tools" 
                className="hidden lg:flex px-5 py-2.5 bg-sky-500 text-white text-sm font-bold rounded-xl hover:bg-sky-600 transition-colors shadow-lg shadow-sky-200"
              >
                Use Tools
              </Link>
              <AuthButton />
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path ? "bg-sky-50 text-sky-600" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <div className="w-8 h-8 bg-white border-2 border-sky-500 rounded-lg flex items-center justify-center text-sky-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-sky-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                    <Settings className="w-2 h-2" />
                  </div>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-black text-slate-900 tracking-tight">
                    DocToo
                  </span>
                  <span className="text-lg font-black text-sky-500 tracking-tight">
                    lHub
                  </span>
                </div>
              </Link>
              <p className="text-slate-500 max-w-md mb-6">
                DocToolHubPK is your one-stop destination for free, fast, and secure online tools. 
                We provide a wide range of utilities for text processing, image editing, development, and SEO.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-sky-500 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-slate-400 hover:text-sky-500 transition-colors"><Github className="w-5 h-5" /></a>
                <a href="mailto:info@doctoolhubpk.com" className="text-slate-400 hover:text-sky-500 transition-colors"><Mail className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-slate-500 hover:text-sky-500 text-sm">Home</Link></li>
                <li><Link to="/all-tools" className="text-slate-500 hover:text-sky-500 text-sm">All Tools</Link></li>
                <li><Link to="/blog" className="text-slate-500 hover:text-sky-500 text-sm">Blog</Link></li>
                <li><Link to="/about" className="text-slate-500 hover:text-sky-500 text-sm">About Us</Link></li>
                <li><Link to="/contact" className="text-slate-500 hover:text-sky-500 text-sm">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Stay Updated</h3>
              <p className="text-sm text-slate-500 mb-4">Get notified about new tools and SEO tips.</p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-500"
                />
                <button className="px-4 py-2 bg-sky-500 text-white text-sm font-bold rounded-lg hover:bg-sky-600 transition-colors">
                  Join
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-4">
                Press <strong>Ctrl + D</strong> to bookmark this site for instant access to 40+ free tools.
              </p>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} DocToolHubPK. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <span className="text-slate-300 text-sm">Designed for Productivity</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
