import React from 'react'
import { Play } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { PLAYLISTS, ALBUMS, ARTISTS, TRACKS } from '../data/mockData'
import { getGreeting, formatCompactNumber } from '../utils/format'

export const HomeView: React.FC = () => {
  const { navigate, playTrack } = usePlayer()
  const greeting = getGreeting()

  // 6 Quick Picks
  const quickPicks = [
    {
      id: 'liked',
      title: 'Liked Songs',
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
      action: () => navigate({ type: 'liked-songs' }),
      playAction: () => playTrack(TRACKS[0], TRACKS)
    },
    ...PLAYLISTS.slice(0, 5).map((pl) => ({
      id: pl.id,
      title: pl.title,
      coverUrl: pl.coverUrl,
      action: () => navigate({ type: 'playlist', playlistId: pl.id }),
      playAction: () => {
        const plTracks = TRACKS.filter((t) => pl.trackIds.includes(t.id))
        if (plTracks.length > 0) playTrack(plTracks[0], plTracks)
      }
    }))
  ]

  return (
    <div className="space-y-8 pb-12 select-none">
      {/* ── Greeting & Quick 6-Pack Grid ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-5">
          {greeting}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickPicks.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              className="flex items-center bg-[#282828]/60 hover:bg-[#333333] transition-all rounded-md overflow-hidden cursor-pointer group shadow-sm"
            >
              <img
                src={item.coverUrl}
                alt={item.title}
                className="w-16 h-16 object-cover shrink-0 bg-[#242424]"
              />
              <span className="font-semibold text-sm text-white px-4 flex-1 truncate">
                {item.title}
              </span>

              {/* Hover Play Button */}
              <div className="pr-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    item.playAction()
                  }}
                  className="w-10 h-10 rounded-full bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-lg cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section: Made For You (Curated Playlists) ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight hover:underline cursor-pointer">
              Made For You
            </h2>
            <p className="text-xs text-[#b3b3b3] mt-0.5">
              Personalized mixes based on your listening habits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              onClick={() => navigate({ type: 'playlist', playlistId: pl.id })}
              className="p-3.5 bg-[#181818] hover:bg-[#282828] transition-all duration-200 rounded-lg cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#242424] shadow-md">
                <img
                  src={pl.coverUrl}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Floating Play Button */}
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

              <div>
                <h3 className="font-semibold text-sm text-white truncate mb-1">
                  {pl.title}
                </h3>
                <p className="text-xs text-[#b3b3b3] line-clamp-2 leading-relaxed">
                  {pl.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Popular Albums ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight hover:underline cursor-pointer">
              Popular Releases
            </h2>
            <p className="text-xs text-[#b3b3b3] mt-0.5">
              The most streamed albums this week
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {ALBUMS.map((album) => (
            <div
              key={album.id}
              onClick={() => navigate({ type: 'album', albumId: album.id })}
              className="p-3.5 bg-[#181818] hover:bg-[#282828] transition-all duration-200 rounded-lg cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#242424] shadow-md">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (album.tracks.length > 0) playTrack(album.tracks[0], album.tracks)
                  }}
                  className="w-11 h-11 rounded-full bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-xl absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-white truncate mb-1">
                  {album.title}
                </h3>
                <p className="text-xs text-[#b3b3b3] truncate">
                  {album.year} • {album.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Featured Artists ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight hover:underline cursor-pointer">
              Featured Artists
            </h2>
            <p className="text-xs text-[#b3b3b3] mt-0.5">
              Verified creators with trending soundscapes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {ARTISTS.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigate({ type: 'artist', artistId: artist.id })}
              className="p-3.5 bg-[#181818] hover:bg-[#282828] transition-all duration-200 rounded-lg cursor-pointer group flex flex-col items-center text-center"
            >
              <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3 bg-[#242424] shadow-md max-w-[180px]">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    const artistTracks = TRACKS.filter((t) => artist.topTrackIds.includes(t.id))
                    if (artistTracks.length > 0) playTrack(artistTracks[0], artistTracks)
                  }}
                  className="w-11 h-11 rounded-full bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-xl absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                </button>
              </div>

              <h3 className="font-semibold text-sm text-white truncate w-full mb-0.5">
                {artist.name}
              </h3>
              <p className="text-xs text-[#b3b3b3]">
                {formatCompactNumber(artist.monthlyListeners)} listeners
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
