import React, { useState } from 'react'
import { Plus, Play } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { ALBUMS, ARTISTS, TRACKS } from '../data/mockData'

export const LibraryView: React.FC = () => {
  const {
    customPlaylists,
    likedTrackIds,
    createPlaylist,
    navigate,
    playTrack
  } = usePlayer()

  const [activeTab, setActiveTab] = useState<'all' | 'playlists' | 'artists' | 'albums'>('all')
  const [isCreating, setIsCreating] = useState(false)
  const [playlistTitle, setPlaylistTitle] = useState('')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playlistTitle.trim()) return
    const id = createPlaylist(playlistTitle.trim())
    setPlaylistTitle('')
    setIsCreating(false)
    navigate({ type: 'playlist', playlistId: id })
  }

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Your Library
          </h1>
          <p className="text-xs text-[#b3b3b3] mt-1">
            Playlists, saved tracks, albums, and artists
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Create Dialog Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <form
            onSubmit={handleCreate}
            className="bg-[#282828] border border-[#383838] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
          >
            <h3 className="text-lg font-bold text-white">Create New Playlist</h3>
            <input
              type="text"
              autoFocus
              value={playlistTitle}
              onChange={(e) => setPlaylistTitle(e.target.value)}
              placeholder="e.g. Late Night Vibes"
              className="w-full bg-[#181818] border border-[#404040] rounded-lg px-3 py-2 text-sm text-white placeholder-[#777777] outline-none focus:border-[#1db954]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-semibold text-[#b3b3b3] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-[#1db954] text-black font-semibold text-xs hover:bg-[#1ed760] cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-2">
        {(['all', 'playlists', 'artists', 'albums'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
              activeTab === tab
                ? 'bg-white text-black'
                : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Library Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {/* Liked Songs Hero Card */}
        {(activeTab === 'all' || activeTab === 'playlists') && (
          <div
            onClick={() => navigate({ type: 'liked-songs' })}
            className="sm:col-span-2 p-5 rounded-lg bg-gradient-to-br from-[#450af5] to-[#8e8ee5] cursor-pointer group flex flex-col justify-end min-h-[220px] shadow-lg relative overflow-hidden"
          >
            <div className="space-y-1 z-10">
              <h3 className="text-2xl font-black text-white">Liked Songs</h3>
              <p className="text-xs text-white/80 font-medium">
                {likedTrackIds.size} liked songs
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                const liked = TRACKS.filter((t) => likedTrackIds.has(t.id))
                if (liked.length > 0) playTrack(liked[0], liked)
              }}
              className="w-12 h-12 rounded-full bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-xl absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black translate-x-0.5" />
            </button>
          </div>
        )}

        {/* Custom and Curated Playlists */}
        {(activeTab === 'all' || activeTab === 'playlists') &&
          customPlaylists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => navigate({ type: 'playlist', playlistId: pl.id })}
              className="p-3.5 bg-[#181818] hover:bg-[#282828] transition-all rounded-lg cursor-pointer group"
            >
              <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#242424] shadow-md">
                <img
                  src={pl.coverUrl}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    const plTracks = TRACKS.filter((t) => pl.trackIds.includes(t.id))
                    if (plTracks.length > 0) playTrack(plTracks[0], plTracks)
                  }}
                  className="w-11 h-11 rounded-full bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-xl absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                </button>
              </div>

              <h4 className="font-semibold text-sm text-white truncate mb-1">
                {pl.title}
              </h4>
              <p className="text-xs text-[#b3b3b3] truncate">
                Playlist • {pl.owner}
              </p>
            </div>
          ))}

        {/* Albums */}
        {(activeTab === 'all' || activeTab === 'albums') &&
          ALBUMS.map((album) => (
            <div
              key={album.id}
              onClick={() => navigate({ type: 'album', albumId: album.id })}
              className="p-3.5 bg-[#181818] hover:bg-[#282828] transition-all rounded-lg cursor-pointer group"
            >
              <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#242424] shadow-md">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>

              <h4 className="font-semibold text-sm text-white truncate mb-1">
                {album.title}
              </h4>
              <p className="text-xs text-[#b3b3b3] truncate">
                Album • {album.artist}
              </p>
            </div>
          ))}

        {/* Artists */}
        {(activeTab === 'all' || activeTab === 'artists') &&
          ARTISTS.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigate({ type: 'artist', artistId: artist.id })}
              className="p-3.5 bg-[#181818] hover:bg-[#282828] transition-all rounded-lg cursor-pointer group flex flex-col items-center text-center"
            >
              <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3 bg-[#242424] shadow-md">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h4 className="font-semibold text-sm text-white truncate w-full mb-1">
                {artist.name}
              </h4>
              <p className="text-xs text-[#b3b3b3]">
                Artist
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}
