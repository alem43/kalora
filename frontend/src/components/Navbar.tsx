import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import logoImage from '../images/logo_image.png'
import logoText from '../images/logo_text.png'
import { api } from '#/lib/api'
import { queryClient } from '#/lib/query-client'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const { data: user } = useQuery({
    queryKey: ['auth'],
    queryFn: api.auth.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const closeMenu = () => setIsMobileMenuOpen(false)

  const handleLogout = async () => {
    await api.auth.logout()
    queryClient.removeQueries({ queryKey: ['auth'] })
    closeMenu()
    navigate({ to: '/login' })
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl px-6 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(130,184,90,0.08)] overflow-hidden">
          <div className="h-16 flex justify-between items-center">
            <Link
              to="/"
              onClick={closeMenu}
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
                className="h-4 w-auto sm:block transform group-hover:translate-x-0.5 transition-transform duration-500"
              />
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-[#173A27] font-bold text-sm tracking-wide hover:text-[#82B85A] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="relative inline-flex items-center justify-center px-5 py-2.5 overflow-hidden font-bold text-white bg-[#173A27] rounded-xl group cursor-pointer"
                  >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#82B85A] rounded-full group-hover:w-56 group-hover:h-56"></span>
                    <span className="relative text-sm tracking-wide">
                      Logout
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[#173A27] font-bold text-sm tracking-wide hover:text-[#82B85A] transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="relative inline-flex items-center justify-center px-5 py-2.5 overflow-hidden font-bold text-white bg-[#173A27] rounded-xl group"
                  >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#82B85A] rounded-full group-hover:w-56 group-hover:h-56"></span>
                    <span className="relative text-sm tracking-wide">
                      Sign Up
                    </span>
                  </Link>
                </>
              )}
            </div>

            <button
              className="md:hidden relative w-8 h-8 flex items-center justify-center text-[#173A27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82B85A] rounded-lg"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              <span
                className={`absolute h-0.5 w-6 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-current rounded-full transition-all duration-200 ${
                  isMobileMenuOpen
                    ? 'opacity-0 scale-x-0'
                    : 'opacity-100 scale-x-100'
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'
                }`}
              />
            </button>
          </div>

          <div
            id="mobile-menu"
            className={`md:hidden grid transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              isMobileMenuOpen
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <nav className="min-h-0 overflow-hidden flex flex-col gap-1 pt-1 pb-5 border-t border-[#173A27]/10 mt-1">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="text-[#173A27] font-bold text-sm tracking-wide py-3 hover:text-[#82B85A] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full text-center px-5 py-2.5 font-bold text-sm text-white bg-[#173A27] rounded-xl hover:bg-[#82B85A] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-[#173A27] font-bold text-sm tracking-wide py-3 hover:text-[#82B85A] transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mt-2 w-full text-center px-5 py-2.5 font-bold text-sm text-white bg-[#173A27] rounded-xl hover:bg-[#82B85A] transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
