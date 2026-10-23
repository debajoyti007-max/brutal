import React, { useState } from 'react'
import { Home, Search, Library, Plus, Heart } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { MontageLogo } from './MontageLogo'

export const Sidebar: React.FC = () => {
  const {
    currentView,
    navigate,
    likedTrackIds,
    customPlaylists,
    createPlaylist
  } = usePlayer()

  const [activeTab, setActiveTab] = useState<'all' | 'playlists' | 'artists' | 'albums'>('all')
  const [filterQuery, setFilterQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const id = createPlaylist(newTitle.trim())
    setNewTitle('')
    setIsCreating(false)
    navigate({ type: 'playlist', playlistId: id })
  }

  const filteredPlaylists = customPlaylists.filter((p) =>
    p.title.toLowerCase().includes(filterQuery.toLowerCase())
  )

  return (
    <aside className="w-72 bg-[#121212] flex flex-col h-full select-none border-r border-[#242424] shrink-0 text-[#b3b3b3]">
      {/* ── Brand Logo Header (Fresh Bespoke Emblem) ── */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div
          onClick={() => navigate({ type: 'home' })}
          className="cursor-pointer group"
        >
          <MontageLogo size={36} />
        </div>
      </div>

      {/* ── Primary Navigation ── */}
      <nav className="px-3 py-2 space-y-1">
        <button
          type="button"
          onClick={() => navigate({ type: 'home' })}
          className={`w-full flex items-center gap-4 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            currentView.type === 'home'
              ? 'text-white bg-[#282828]'
              : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView.type === 'home' ? 'text-[#1db954]' : ''}`} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => navigate({ type: 'search' })}
          className={`w-full flex items-center gap-4 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            currentView.type === 'search'
              ? 'text-white bg-[#282828]'
              : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Search className={`w-5 h-5 ${currentView.type === 'search' ? 'text-[#1db954]' : ''}`} />
          <span>Search</span>
        </button>
      </nav>

      {/* ── Library Container ── */}
      <div className="flex-1 mt-2 bg-[#121212] flex flex-col min-h-0 border-t border-[#1e1e1e]">
        {/* Library Header */}
        <div className="p-4 pb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ type: 'library' })}
            className={`flex items-center gap-3 text-sm font-bold transition-colors cursor-pointer ${
              currentView.type === 'library' ? 'text-white' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Library className="w-5 h-5" />
            <span>Your Library</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            title="Create Playlist"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#b3b3b3] hover:text-white hover:bg-[#242424] transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Create Playlist Inline Form */}
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="mx-3 my-2 p-3 bg-[#242424] rounded-xl space-y-2 border border-[#333333]">
            <span className="text-xs font-semibold text-white block">New Playlist</span>
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="My Playlist #1"
              className="w-full bg-[#181818] border border-[#383838] rounded-md px-2.5 py-1.5 text-xs text-white placeholder-[#666666] outline-none focus:border-[#1db954]"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-2.5 py-1 text-xs text-[#b3b3b3] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-[#1db954] hover:bg-[#1ed760] text-black font-semibold text-xs rounded-md cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {/* Filter Pills */}
        <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'playlists', 'artists', 'albums'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer shrink-0 ${
                activeTab === tab
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input for Library Filter */}
        <div className="px-3 py-1.5">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter library..."
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded px-2.5 py-1 text-xs text-white placeholder-[#666666] outline-none focus:border-[#1db954]"
          />
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {/* Liked Songs Entry */}
          {(activeTab === 'all' || activeTab === 'playlists') && (
            <div
              onClick={() => navigate({ type: 'liked-songs' })}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                currentView.type === 'liked-songs'
                  ? 'bg-[#282828] text-white'
                  : 'hover:bg-[#1a1a1a] text-[#b3b3b3] hover:text-white'
              }`}
            >
              <div className="w-12 h-12 rounded bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow-sm">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  Liked Songs
                </span>
                <span className="text-xs text-[#b3b3b3] flex items-center gap-1">
                  <span>Playlist</span>
                  <span>•</span>
                  <span>{likedTrackIds.size} songs</span>
                </span>
              </div>
            </div>
          )}

          {/* User & Curated Playlists */}
          {(activeTab === 'all' || activeTab === 'playlists') &&
            filteredPlaylists.map((playlist) => {
              const isActive =
                currentView.type === 'playlist' && currentView.playlistId === playlist.id
              return (
                <div
                  key={playlist.id}
                  onClick={() => navigate({ type: 'playlist', playlistId: playlist.id })}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#282828] text-white'
                      : 'hover:bg-[#1a1a1a] text-[#b3b3b3] hover:text-white'
                  }`}
                >
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.title}
                    className="w-12 h-12 rounded object-cover shrink-0 bg-[#242424]"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-semibold truncate ${isActive ? 'text-[#1db954]' : 'text-white'}`}>
                      {playlist.title}
                    </span>
                    <span className="text-xs text-[#b3b3b3] flex items-center gap-1">
                      <span>Playlist</span>
                      <span>•</span>
                      <span>{playlist.owner}</span>
                    </span>
                  </div>
                </div>
              )
            })}

          {/* Artists shortcut when tab active */}
          {(activeTab === 'all' || activeTab === 'artists') && (
            <div
              onClick={() => navigate({ type: 'artist', artistId: 'artist-1' })}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#1a1a1a] text-[#b3b3b3] hover:text-white transition-colors"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                alt="Luna Eclipse"
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  Luna Eclipse
                </span>
                <span className="text-xs text-[#b3b3b3]">Artist</span>
              </div>
            </div>
          )}

          {/* Albums shortcut when tab active */}
          {(activeTab === 'all' || activeTab === 'albums') && (
            <div
              onClick={() => navigate({ type: 'album', albumId: 'album-1' })}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#1a1a1a] text-[#b3b3b3] hover:text-white transition-colors"
            >
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop"
                alt="Nocturnal Echoes"
                className="w-12 h-12 rounded object-cover shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  Nocturnal Echoes
                </span>
                <span className="text-xs text-[#b3b3b3]">Album • Luna Eclipse</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
