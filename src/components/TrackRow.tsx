import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Heart, MoreHorizontal, Plus, Check, Link as LinkIcon, User, Disc } from 'lucide-react'
import type { Track } from '../types'
import { usePlayer } from '../context/PlayerContext'
import { formatTime } from '../utils/format'

interface TrackRowProps {
  track: Track
  index: number
  contextQueue?: Track[]
  showCover?: boolean
  showAlbum?: boolean
  showDateAdded?: boolean
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  contextQueue,
  showCover = true,
  showAlbum = true,
  showDateAdded = true
}) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    likedTrackIds,
    toggleLike,
    customPlaylists,
    addTrackToPlaylist,
    showToast,
    navigate
  } = usePlayer()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isCurrent = currentTrack?.id === track.id
  const isLiked = likedTrackIds.has(track.id)

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay()
    } else {
      playTrack(track, contextQueue)
    }
  }

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(window.location.origin + window.location.pathname)
    showToast('Link copied to clipboard')
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      onDoubleClick={handleRowClick}
      className={`group grid grid-cols-[16px_4fr_2fr_1fr] md:grid-cols-[20px_4fr_3fr_2fr_minmax(60px,1fr)] items-center gap-4 px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer text-sm select-none ${
        isCurrent ? 'bg-white/5' : ''
      }`}
    >
      {/* 1. Track Index / Play Button / Spotify 4-Bar Equalizer */}
      <div className="flex items-center justify-center text-xs text-[#b3b3b3] font-mono">
        {isCurrent && isPlaying ? (
          <div className="flex items-end gap-[2px] h-4 group-hover:hidden">
            <span className="w-1 bg-[#1db954] rounded-sm animate-equalize-1" />
            <span className="w-1 bg-[#1db954] rounded-sm animate-equalize-2" />
            <span className="w-1 bg-[#1db954] rounded-sm animate-equalize-3" />
            <span className="w-1 bg-[#1db954] rounded-sm animate-equalize-4" />
          </div>
        ) : (
          <span className={`tabular-nums ${isCurrent ? 'text-[#1db954]' : ''} group-hover:hidden`}>
            {index + 1}
          </span>
        )}

        {/* Hover Play / Pause Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleRowClick()
          }}
          className="hidden group-hover:flex items-center justify-center text-white cursor-pointer"
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-white translate-x-0.5" />
          )}
        </button>
      </div>

      {/* 2. Title & Artist Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        {showCover && (
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-10 h-10 rounded object-cover shrink-0 bg-[#242424]"
          />
        )}
        <div className="flex flex-col min-w-0 pr-2">
          <span
            className={`font-medium truncate ${
              isCurrent ? 'text-[#1db954]' : 'text-white'
            }`}
          >
            {track.title}
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation()
              if (track.artistId) {
                navigate({ type: 'artist', artistId: track.artistId })
              }
            }}
            className="text-xs text-[#b3b3b3] truncate hover:underline hover:text-white"
          >
            {track.artist}
          </span>
        </div>
      </div>

      {/* 3. Album Column */}
      {showAlbum && (
        <div
          onClick={(e) => {
            e.stopPropagation()
            if (track.albumId) {
              navigate({ type: 'album', albumId: track.albumId })
            }
          }}
          className="hidden md:block text-xs text-[#b3b3b3] truncate hover:text-white hover:underline"
        >
          {track.album}
        </div>
      )}

      {/* 4. Date Added Column */}
      {showDateAdded && (
        <div className="hidden md:block text-xs text-[#b3b3b3] truncate">
          {track.addedAt || 'Recently'}
        </div>
      )}

      {/* 5. Like Button, Duration, and Options Menu */}
      <div className="flex items-center justify-end gap-3 text-xs text-[#b3b3b3] tabular-nums font-mono relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleLike(track.id)
          }}
          className={`p-1 cursor-pointer transition-colors ${
            isLiked ? 'text-[#1db954] opacity-100' : 'opacity-0 group-hover:opacity-100 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#1db954]' : ''}`} />
        </button>

        <span>{formatTime(track.duration)}</span>

        {/* More Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(!isMenuOpen)
            }}
            className="p-1 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-6 w-52 bg-[#282828] border border-[#383838] rounded-md shadow-2xl py-1 text-xs text-white z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLike(track.id)
                  setIsMenuOpen(false)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#383838] transition-colors text-left"
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#1db954] text-[#1db954]' : ''}`} />
                <span>{isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#383838] transition-colors text-left"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Copy Song Link</span>
              </button>

              {track.artistId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate({ type: 'artist', artistId: track.artistId })
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#383838] transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Go to Artist</span>
                </button>
              )}

              {track.albumId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate({ type: 'album', albumId: track.albumId })
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#383838] transition-colors text-left"
                >
                  <Disc className="w-3.5 h-3.5" />
                  <span>Go to Album</span>
                </button>
              )}

              <div className="h-px bg-[#383838] my-1" />

              <span className="px-3 py-1.5 text-[10px] uppercase font-semibold text-[#888888] block">
                Add to playlist
              </span>
              {customPlaylists.map((pl) => {
                const inPl = pl.trackIds.includes(track.id)
                return (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      addTrackToPlaylist(pl.id, track.id)
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#383838] transition-colors text-left"
                  >
                    <span className="truncate">{pl.title}</span>
                    {inPl ? (
                      <Check className="w-3.5 h-3.5 text-[#1db954]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-[#b3b3b3]" />
                    )}
                  </button>
                )}
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
