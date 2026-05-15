import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar'

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
          <span className="text-xl font-bold text-gray-400">#</span>
        </div>
        <span className="text-3xl font-bold tracking-tighter text-kalora-dark-green">
          Kalora
        </span>
      </div>
      <nav className="space-x-8 text-base font-medium">
        <a
          href="#philosophy"
          className="text-gray-700 hover:text-kalora-dark-green transition-colors"
        >
          Our Philosophy
        </a>
        <a
          href="#features"
          className="text-gray-700 hover:text-kalora-dark-green transition-colors"
        >
          Key Features
        </a>
        <a
          href="/login"
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign In
        </a>
        <a
          href="/register"
          className="bg-avocado-500 text-kalora-dark-green px-5 py-3 rounded-full hover:bg-avocado-400 transition-colors font-bold shadow-sm"
        >
          Discover Your Cadence
        </a>
      </nav>
    </header>
  )
}

export default Navbar
