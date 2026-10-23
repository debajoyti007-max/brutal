import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, LogOut, Settings, ExternalLink } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

interface HeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  isScrolled?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  isScrolled = false
}) => {
  const { currentView, canGoBack, canGoForward, goBack, goForward, navigate } = usePlayer()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={`h-16 px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 select-none ${
        isScrolled ? 'bg-[#121212]/95 backdrop-blur-md shadow-md border-b border-[#242424]' : 'bg-transparent'
      }`}
    >
      {/* Left: Navigation Buttons & Contextual Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            title="Go back"
            className={`w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white transition-opacity cursor-pointer ${
              canGoBack ? 'opacity-100 hover:bg-black/90' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goForward}
            disabled={!canGoForward}
            title="Go forward"
            className={`w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white transition-opacity cursor-pointer ${
              canGoForward ? 'opacity-100 hover:bg-black/90' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input when on Search Page */}
        {currentView.type === 'search' && onSearchChange && (
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-[#b3b3b3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="What do you want to play?"
              className="w-full h-10 pl-10 pr-4 rounded-full bg-[#242424] text-sm text-white placeholder-[#b3b3b3] outline-none focus:ring-2 focus:ring-white/40 transition-all"
            />
          </div>
        )}
      </div>

      {/* Right: User Profile Menu */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 p-1 pr-3 rounded-full bg-black/50 hover:bg-[#282828] transition-colors cursor-pointer border border-[#333333]"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
            alt="Profile avatar"
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-xs font-semibold text-white tracking-wide">
            Montage
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#282828] border border-[#383838] rounded-lg shadow-2xl py-1 text-xs text-[#e0e0e0] z-50 animate-in fade-in zoom-in-95 duration-100">
            <button
              type="button"
              onClick={() => {
                navigate({ type: 'library' })
                setIsDropdownOpen(false)
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#333333] transition-colors text-left"
            >
              <span>Your Library</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#b3b3b3]" />
            </button>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#333333] transition-colors text-left"
            >
              <Settings className="w-3.5 h-3.5 text-[#b3b3b3]" />
              <span>Settings</span>
            </button>
            <div className="h-px bg-[#383838] my-1" />
            <button
              type="button"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#333333] text-red-400 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
