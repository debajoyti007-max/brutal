import React, { useState, useRef } from 'react'
import { Home, Search, Library } from 'lucide-react'
import { PlayerProvider, usePlayer } from './context/PlayerContext'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { PlayerBar } from './components/PlayerBar'
import { NowPlayingView } from './components/NowPlayingView'
import { QueueDrawer } from './components/QueueDrawer'
import { Toast } from './components/Toast'
import { HomeView } from './views/HomeView'
import { SearchView } from './views/SearchView'
import { LibraryView } from './views/LibraryView'
import { PlaylistView } from './views/PlaylistView'
import { ArtistView } from './views/ArtistView'
import { LyricsView } from './views/LyricsView'

const MainAppContent: React.FC = () => {
  const { currentView, currentThemeColor, navigate } = usePlayer()
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const mainScrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (mainScrollRef.current) {
      setIsScrolled(mainScrollRef.current.scrollTop > 30)
    }
  }

  const renderCurrentView = () => {
    switch (currentView.type) {
      case 'home':
        return <HomeView />
      case 'search':
        return <SearchView searchQuery={searchQuery} />
      case 'library':
        return <LibraryView />
      case 'playlist':
        return <PlaylistView playlistId={currentView.playlistId} />
      case 'album':
        return <PlaylistView albumId={currentView.albumId} />
      case 'artist':
        return <ArtistView artistId={currentView.artistId} />
      case 'liked-songs':
        return <PlaylistView isLikedSongs />
      case 'lyrics':
        return <LyricsView />
      default:
        return <HomeView />
    }
  }

  return (
    <div className="flex h-screen w-screen bg-[#121212] text-white font-sans overflow-hidden relative">
      {/* ── Dynamic Spotify Ambient Glow Wash ── */}
      <div
        className="absolute top-0 left-0 right-0 h-96 pointer-events-none transition-colors duration-1000 ease-out z-0 opacity-40 animate-ambient-glow"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -20%, ${currentThemeColor} 0%, rgba(18, 18, 18, 0) 100%)`
        }}
      />

      {/* ── Desktop Sidebar (Hidden on mobile) ── */}
      <div className="hidden md:flex h-full z-20">
        <Sidebar />
      </div>

      {/* ── Main Scrollable Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        <div
          ref={mainScrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto pb-[140px] md:pb-[90px]"
        >
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isScrolled={isScrolled}
          />
          <main className="px-4 sm:px-8 pt-4">
            {renderCurrentView()}
          </main>
        </div>
      </div>

      {/* ── Optional Right Panels (Now Playing or Queue) ── */}
      <NowPlayingView />
      <QueueDrawer />

      {/* ── Floating Spotify Toast Alert ── */}
      <Toast />

      {/* ── Mobile Navigation Bar (Visible only on mobile screens < 768px) ── */}
      <nav className="md:hidden fixed bottom-[90px] left-0 right-0 h-12 bg-[#121212]/95 backdrop-blur-lg border-t border-[#242424] flex items-center justify-around z-30 px-4">
        <button
          type="button"
          onClick={() => navigate({ type: 'home' })}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
            currentView.type === 'home' ? 'text-[#1db954]' : 'text-[#b3b3b3]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => navigate({ type: 'search' })}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
            currentView.type === 'search' ? 'text-[#1db954]' : 'text-[#b3b3b3]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>

        <button
          type="button"
          onClick={() => navigate({ type: 'library' })}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
            currentView.type === 'library' ? 'text-[#1db954]' : 'text-[#b3b3b3]'
          }`}
        >
          <Library className="w-4 h-4" />
          <span>Your Library</span>
        </button>
      </nav>

      {/* ── Fixed Bottom Music Player ── */}
      <PlayerBar />
    </div>
  )
}

export default function App() {
  return (
    <PlayerProvider>
      <MainAppContent />
    </PlayerProvider>
  )
}
