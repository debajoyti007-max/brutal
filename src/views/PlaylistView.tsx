import React from 'react'
import { Play, Pause, Heart, Clock, MoreHorizontal } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { PLAYLISTS, ALBUMS, TRACKS } from '../data/mockData'
import { TrackRow } from '../components/TrackRow'
import { formatTotalDuration } from '../utils/format'

interface PlaylistViewProps {
  playlistId?: string
  albumId?: string
  isLikedSongs?: boolean
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlistId,
  albumId,
  isLikedSongs = false
}) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    likedTrackIds,
    customPlaylists
  } = usePlayer()

  // Determine metadata based on props
  let title = ''
  let description = ''
  let coverUrl = ''
  let themeColor = '#1e3a5f'
  let owner = 'Montage'
  let tracks: typeof TRACKS = []
  let typeLabel = 'PLAYLIST'

  if (isLikedSongs) {
    title = 'Liked Songs'
    description = 'Your collection of favorite tracks.'
    coverUrl = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'
    themeColor = '#450af5'
    owner = 'You'
    typeLabel = 'PLAYLIST'
    tracks = TRACKS.filter((t) => likedTrackIds.has(t.id))
  } else if (albumId) {
    const album = ALBUMS.find((a) => a.id === albumId) || ALBUMS[0]
    title = album.title
    description = `${album.artist} • ${album.year} • ${album.genre}`
    coverUrl = album.coverUrl
    themeColor = album.themeColor || '#2b3a4a'
    owner = album.artist
    typeLabel = 'ALBUM'
    tracks = album.tracks
  } else if (playlistId) {
    const pl =
      customPlaylists.find((p) => p.id === playlistId) ||
      PLAYLISTS.find((p) => p.id === playlistId) ||
      PLAYLISTS[0]
    title = pl.title
    description = pl.description
    coverUrl = pl.coverUrl
    themeColor = pl.themeColor || '#1f4837'
    owner = pl.owner
    typeLabel = 'PLAYLIST'
    tracks = TRACKS.filter((t) => pl.trackIds.includes(t.id))
  }

  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0)
  const isCurrentPlaylistPlaying =
    isPlaying && tracks.some((t) => t.id === currentTrack?.id)

  const handlePlayAll = () => {
    if (tracks.length === 0) return
    if (isCurrentPlaylistPlaying) {
      togglePlay()
    } else {
      playTrack(tracks[0], tracks)
    }
  }

  return (
    <div className="select-none pb-16 -mt-16">
      {/* ── Dynamic Colored Hero Banner ── */}
      <div
        className="px-8 pt-24 pb-8 flex flex-col md:flex-row items-end gap-6 transition-colors duration-500 relative"
        style={{
          background: `linear-gradient(180deg, ${themeColor} 0%, rgba(18, 18, 18, 0.95) 100%)`
        }}
      >
        {/* Cover Artwork */}
        <div className="w-52 h-52 shrink-0 rounded-md overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)] bg-[#242424]">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header Metadata */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {typeLabel}
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none break-words">
            {title}
          </h1>

          {description && (
            <p className="text-sm text-[#d4d4d4] font-medium line-clamp-2 mt-1">
              {description}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs font-semibold text-white/90 mt-1">
            <span>{owner}</span>
            <span>•</span>
            <span>{tracks.length} songs</span>
            {totalDuration > 0 && (
              <>
                <span>•</span>
                <span className="text-white/70">{formatTotalDuration(totalDuration)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="px-8 py-6 flex items-center gap-6 bg-[#121212]">
        <button
          type="button"
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          title={isCurrentPlaylistPlaying ? 'Pause' : 'Play'}
          className={`w-14 h-14 rounded-full bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-xl transition-all cursor-pointer ${
            tracks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isCurrentPlaylistPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          )}
        </button>

        <button
          type="button"
          className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
        >
          <Heart className="w-7 h-7" />
        </button>

        <button
          type="button"
          className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-7 h-7" />
        </button>
      </div>

      {/* ── Tracklist Table ── */}
      <div className="px-8 bg-[#121212]">
        {/* Table Header */}
        <div className="grid grid-cols-[16px_4fr_2fr_1fr] md:grid-cols-[20px_4fr_3fr_2fr_minmax(60px,1fr)] items-center gap-4 px-4 py-2 text-xs font-semibold text-[#b3b3b3] border-b border-[#282828] uppercase tracking-wider mb-2">
          <span>#</span>
          <span>Title</span>
          <span className="hidden md:block">Album</span>
          <span className="hidden md:block">Date added</span>
          <div className="flex justify-end">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Tracks List */}
        {tracks.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#888888]">
            No tracks found in this collection.
          </div>
        ) : (
          <div className="space-y-0.5">
            {tracks.map((track, i) => (
              <TrackRow
                key={`${track.id}-${i}`}
                track={track}
                index={i}
                contextQueue={tracks}
                showAlbum={!albumId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
