import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onGetStarted: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 pointer-events-none ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer pointer-events-auto" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Aria</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 pointer-events-auto">
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
          <div className="block pointer-events-auto">
            <button 
              onClick={onGetStarted}
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95 transform duration-150 cursor-pointer"
            >
              Get Started
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;