import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImage from '../images/logo_image.png'
import logoText from '../images/logo_text.png'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl h-16 px-6 flex justify-between items-center transition-all duration-500 hover:shadow-[0_8px_30px_rgb(130,184,90,0.08)]">
          <Link
            to="/"
            className="flex items-center space-x-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82B85A] rounded-lg p-1"
            aria-label="Kalora Home"
          >
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute inset-0 bg-[#82B85A] rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <img
                src={logoImage}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain relative transform group-hover:rotate-12 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              />
            </div>
            <img
              src={logoText}
              alt="Kalora"
              className="h-4 w-auto hidden sm:block transform group-hover:translate-x-0.5 transition-transform duration-500"
            />
          </Link>
          <nav
            className="hidden md:flex items-center space-x-8"
            aria-label="Main Navigation"
          >
            <a
              href="#approach"
              className="text-[#173A27] font-bold text-sm tracking-wide relative py-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82B85A] rounded-md px-1"
            >
              <span>The Logic</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#82B85A] group-hover:w-full transition-all duration-300 ease-out"></span>
            </a>
            <a
              href="#features"
              className="text-[#173A27] font-bold text-sm tracking-wide relative py-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82B85A] rounded-md px-1"
            >
              <span>Features</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#82B85A] group-hover:w-full transition-all duration-300 ease-out"></span>
            </a>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-[#173A27] font-bold text-sm tracking-wide hover:text-[#82B85A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82B85A] rounded-md px-2 py-1"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="relative inline-flex items-center justify-center px-5 py-2.5 overflow-hidden font-bold text-white bg-[#173A27] rounded-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#173A27]"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#82B85A] rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="relative text-sm tracking-wide">Sign Up</span>
            </Link>
          </div>
          <button
            className="md:hidden p-2 text-[#173A27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82B85A] rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
