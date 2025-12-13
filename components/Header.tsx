import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { zIndex } from '../constants';

interface HeaderProps {
  onGetStarted: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}
      style={{ zIndex: zIndex.header }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 relative">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-bold text-gray-900 tracking-tight"
              aria-label="Scroll to top"
            >
              Aria
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              onClick={(e) => scrollToSection(e, 'features')}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => scrollToSection(e, 'pricing')}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#testimonials" 
              onClick={(e) => scrollToSection(e, 'testimonials')}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Testimonials
            </a>
          </nav>

          {/* CTA Button (Visible on Mobile & Desktop) */}
          <div className="block">
            <button 
              onClick={onGetStarted}
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95 transform duration-150"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden ml-3">
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg border border-gray-200 bg-white/90 shadow-sm text-gray-700 hover:bg-gray-100 active:scale-95 transition"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          <div
            className={`absolute top-full left-0 right-0 mt-3 md:hidden transition-all duration-200 origin-top ${
              isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
            style={{ zIndex: zIndex.dropdown }}
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden px-4 mx-4">
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, 'features')}
                className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, 'pricing')}
                className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 border-t border-gray-100"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                onClick={(e) => scrollToSection(e, 'testimonials')}
                className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 border-t border-gray-100"
              >
                Testimonials
              </a>
              <button
                type="button"
                onClick={() => { setIsMenuOpen(false); onGetStarted(); }}
                className="w-full text-left px-5 py-3 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border-t border-gray-100"
              >
                Get Started
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
