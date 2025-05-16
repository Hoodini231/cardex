"use client"

import React from "react"

import Link from "next/link"
import { useState } from "react"
import { Home, Menu, Search, User, Heart, BarChart2, LayoutDashboard } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export function NavBar({ onSearch }: { onSearch?: (query: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    // Debounce search to avoid too many updates
    const timeoutId = setTimeout(() => {
      onSearch?.(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-white">POKÉ</span>
                <span className="text-red-500">CARD</span>
                <span className="text-white">EX</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/" label="Home" icon={<Home className="h-4 w-4 mr-1" />} />
            <NavLink href="/collections" label="Collections" icon={<LayoutDashboard className="h-4 w-4 mr-1" />} />
            <NavLink href="/roi-calculator" label="ROI" icon={<User className="h-4 w-4 mr-1" />} />
            <NavLink href="/my-collection" label="My Collection" icon={<User className="h-4 w-4 mr-1" />} />
            <NavLink href="/market-watch" label="Market Watch" icon={<BarChart2 className="h-4 w-4 mr-1" />} />
            <NavLink href="/wishlist" label="WishList" icon={<Heart className="h-4 w-4 mr-1" />} />
            <a href="http://3.27.248.98:8501/" className="text-white hover:text-blue-200 transition-colors">
              Collection Assistant
            </a>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className="text-white hover:bg-blue-700">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="py-3 border-t border-blue-500">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for cards, sets, or Pokémon..."
                className="pl-10 bg-white/10 border-blue-500 text-white placeholder:text-blue-200 focus:bg-white/20"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-blue-500 pt-3">
            <div className="flex flex-col space-y-3">
              <MobileNavLink href="/" label="Home" icon={<Home className="h-4 w-4 mr-2" />} />
              <MobileNavLink href="/collections" label="Collections" icon={<LayoutDashboard className="h-4 w-4 mr-2" />} />
              <MobileNavLink href="/roi-calculator" label="ROI Calculator" icon={<User className="h-4 w-4 mr-2" />} />
              <MobileNavLink href="/my-collection" label="My Collection" icon={<User className="h-4 w-4 mr-2" />} />
              <MobileNavLink href="/market-watch" label="Market Watch" icon={<BarChart2 className="h-4 w-4 mr-2" />} />
              <MobileNavLink href="/wishlist" label="WishList" icon={<Heart className="h-4 w-4 mr-2" />} />
              <a href="http://3.27.248.98:8501/" className="text-white hover:text-blue-200 transition-colors">
              Collection Assistant
            </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
      {icon}
      {label}
    </Link>
  )
}

function MobileNavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="text-white hover:text-blue-200 transition-colors py-2 font-medium flex items-center">
      {icon}
      {label}
    </Link>
  )
}

