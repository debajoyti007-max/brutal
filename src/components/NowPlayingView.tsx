import React from 'react'
import { X, Heart, Music2 } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { ARTISTS, ALBUMS } from '../data/mockData'
import { formatCompactNumber } from '../utils/format'

export const NowPlayingView: React.FC = () => {
  const {
    currentTrack,
    isNowPlayingExpanded,
    setIsNowPlayingExpanded,
    likedTrackIds,
    toggleLike,
    navigate
  } = usePlayer()

  if (!isNowPlayingExpanded || !currentTrack) return null

  const isLiked = likedTrackIds.has(currentTrack.id)
  const artist = ARTISTS.find((a) => a.id === currentTrack.artistId) || ARTISTS[0]
  const album = ALBUMS.find((al) => al.id === currentTrack.albumId) || ALBUMS[0]

  return (
    <aside className="w-80 bg-[#121212] border-l border-[#242424] flex flex-col h-full shrink-0 select-none overflow-y-auto text-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between sticky top-0 bg-[#121212]/95 backdrop-blur-md z-10 border-b border-[#242424]">
        <span className="text-sm font-bold text-white tracking-wide truncate">
          {album.title}
        </span>
        <button
          type="button"
          onClick={() => setIsNowPlayingExpanded(false)}
          title="Close panel"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#b3b3b3] hover:text-white hover:bg-[#242424] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Large Album Artwork */}
        <div className="w-full aspect-square rounded-lg overflow-hidden shadow-2xl bg-[#1e1e1e] group relative">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
        </div>

        {/* Title, Artist, and Like Action */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <h3
              onClick={() => {
                if (currentTrack.albumId) {
                  navigate({ type: 'album', albumId: currentTrack.albumId })
                }
              }}
              className="text-lg font-bold text-white truncate cursor-pointer hover:underline"
            >
              {currentTrack.title}
            </h3>
            <span
              onClick={() => {
                if (currentTrack.artistId) {
                  navigate({ type: 'artist', artistId: currentTrack.artistId })
                }
              }}
              className="text-sm text-[#b3b3b3] truncate cursor-pointer hover:underline hover:text-white"
            >
              {currentTrack.artist}
            </span>
          </div>

          <button
            type="button"
            onClick={() => toggleLike(currentTrack.id)}
            title={isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
            className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer shrink-0 mt-1"
          >
            <Heart
              className={`w-5 h-5 transition-transform active:scale-125 ${
                isLiked ? 'text-[#1db954] fill-[#1db954]' : ''
              }`}
            />
          </button>
        </div>

        {/* Lyrics Section */}
        {currentTrack.lyrics && currentTrack.lyrics.length > 0 && (
          <div className="bg-[#242424] rounded-xl p-4 space-y-2 border border-[#303030]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
              <Music2 className="w-3.5 h-3.5 text-[#1db954]" />
              <span>Lyrics</span>
            </div>
            <div className="space-y-2 text-sm text-[#d4d4d4] font-medium leading-relaxed">
              {currentTrack.lyrics.map((line, idx) => (
                <p
                  key={idx}
                  className={`transition-colors ${
                    idx === 0 || idx === 1 ? 'text-white font-semibold' : 'text-[#888888]'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* About the Artist Card */}
        {artist && (
          <div className="bg-[#242424] rounded-xl overflow-hidden border border-[#303030]">
            <div className="relative h-28 w-full overflow-hidden">
              <img
                src={artist.headerUrl}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#242424] to-transparent" />
              <span className="absolute top-3 left-3 text-xs font-bold text-white uppercase tracking-wider">
                About the artist
              </span>
            </div>

            <div className="p-4 pt-1 space-y-3">
              <div
                onClick={() => navigate({ type: 'artist', artistId: artist.id })}
                className="cursor-pointer group inline-block"
              >
                <h4 className="text-base font-bold text-white group-hover:underline">
                  {artist.name}
                </h4>
                <p className="text-xs text-[#b3b3b3]">
                  {formatCompactNumber(artist.monthlyListeners)} monthly listeners
                </p>
              </div>

              <p className="text-xs text-[#b3b3b3] line-clamp-3 leading-relaxed">
                {artist.bio}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
