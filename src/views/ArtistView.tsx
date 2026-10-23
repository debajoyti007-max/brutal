import React, { useState } from 'react'
import { Play, Pause, MoreHorizontal } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { ARTISTS, TRACKS, ALBUMS } from '../data/mockData'
import { TrackRow } from '../components/TrackRow'
import { formatNumber } from '../utils/format'

interface ArtistViewProps {
  artistId: string
}

export const ArtistView: React.FC<ArtistViewProps> = ({ artistId }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, navigate } = usePlayer()
  const [isFollowing, setIsFollowing] = useState(false)

  const artist = ARTISTS.find((a) => a.id === artistId) || ARTISTS[0]
  const topTracks = TRACKS.filter((t) => artist.topTrackIds.includes(t.id))
  const artistAlbums = ALBUMS.filter((al) => artist.albumIds.includes(al.id))

  const isCurrentArtistPlaying =
    isPlaying && topTracks.some((t) => t.id === currentTrack?.id)

  const handlePlayArtist = () => {
    if (topTracks.length === 0) return
    if (isCurrentArtistPlaying) {
      togglePlay()
    } else {
      playTrack(topTracks[0], topTracks)
    }
  }

  return (
    <div className="select-none pb-16 -mt-16">
      {/* ── Full Bleed Artist Banner ── */}
      <div className="relative h-72 md:h-80 w-full overflow-hidden flex flex-col justify-end p-8">
        <img
          src={artist.headerUrl}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />

        <div className="relative z-10 space-y-2">
          {artist.verified && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <span className="w-4 h-4 rounded-full bg-[#1da1f2] flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
              <span>Verified Artist</span>
            </div>
          )}

          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight">
            {artist.name}
          </h1>

          <p className="text-sm font-semibold text-white/90">
            {formatNumber(artist.monthlyListeners)} monthly listeners
          </p>
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="px-8 py-6 flex items-center gap-6 bg-[#121212]">
        <button
          type="button"
          onClick={handlePlayArtist}
          title={isCurrentArtistPlaying ? 'Pause' : 'Play'}
          className="w-14 h-14 rounded-full bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-xl transition-all cursor-pointer"
        >
          {isCurrentArtistPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
            isFollowing
              ? 'border-[#1db954] text-[#1db954] bg-[#1db954]/10'
              : 'border-[#727272] text-white hover:border-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <button
          type="button"
          className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-7 h-7" />
        </button>
      </div>

      <div className="px-8 space-y-10">
        {/* ── Popular Tracks ── */}
        <section>
          <h2 className="text-xl font-bold text-white tracking-tight mb-4">
            Popular
          </h2>

          <div className="space-y-0.5">
            {topTracks.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i}
                contextQueue={topTracks}
                showDateAdded={false}
              />
            ))}
          </div>
        </section>

        {/* ── Discography (Albums) ── */}
        {artistAlbums.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white tracking-tight mb-4">
              Discography
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {artistAlbums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => navigate({ type: 'album', albumId: album.id })}
                  className="p-3.5 bg-[#181818] hover:bg-[#282828] transition-all rounded-lg cursor-pointer group"
                >
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full aspect-square rounded-md object-cover shadow-md mb-3"
                  />
                  <h4 className="font-semibold text-sm text-white truncate">
                    {album.title}
                  </h4>
                  <p className="text-xs text-[#b3b3b3]">
                    {album.year} • Album
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── About Bio Card ── */}
        <section>
          <h2 className="text-xl font-bold text-white tracking-tight mb-4">
            About
          </h2>

          <div className="relative rounded-2xl overflow-hidden bg-[#242424] max-w-2xl border border-[#333333] group cursor-pointer">
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-transparent to-transparent" />
            </div>

            <div className="p-6 space-y-3">
              <span className="text-lg font-bold text-white font-mono">
                {formatNumber(artist.monthlyListeners)} monthly listeners
              </span>
              <p className="text-sm text-[#b3b3b3] leading-relaxed">
                {artist.bio}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
