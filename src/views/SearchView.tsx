import React from 'react'
import { Play } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { TRACKS, ARTISTS, ALBUMS, BROWSE_CATEGORIES } from '../data/mockData'
import { TrackRow } from '../components/TrackRow'

interface SearchViewProps {
  searchQuery: string
}

export const SearchView: React.FC<SearchViewProps> = ({ searchQuery }) => {
  const { playTrack, navigate } = usePlayer()

  const trimmed = searchQuery.trim().toLowerCase()

  // Filter items
  const matchingTracks = TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(trimmed) ||
      t.artist.toLowerCase().includes(trimmed) ||
      t.album.toLowerCase().includes(trimmed)
  )

  const matchingArtists = ARTISTS.filter((a) =>
    a.name.toLowerCase().includes(trimmed)
  )

  const matchingAlbums = ALBUMS.filter(
    (al) =>
      al.title.toLowerCase().includes(trimmed) ||
      al.artist.toLowerCase().includes(trimmed)
  )

  const topResult = matchingTracks[0] || null

  return (
    <div className="space-y-8 pb-12 select-none">
      {/* ── When No Search Query: Show Browse Categories ── */}
      {!trimmed ? (
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-5">
            Browse all
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
            {BROWSE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  const related = TRACKS[Math.floor(Math.random() * TRACKS.length)]
                  playTrack(related, TRACKS)
                }}
                className="relative h-44 rounded-lg p-4 overflow-hidden cursor-pointer shadow-md hover:scale-[1.02] transition-transform duration-200 select-none"
                style={{ backgroundColor: cat.color }}
              >
                <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
                  {cat.name}
                </h3>

                <img
                  src={cat.coverUrl}
                  alt={cat.name}
                  className="w-24 h-24 rounded object-cover shadow-2xl absolute -bottom-2 -right-3 rotate-[25deg] pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Live Search Results ── */
        <div className="space-y-8">
          {matchingTracks.length === 0 &&
          matchingArtists.length === 0 &&
          matchingAlbums.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <h3 className="text-lg font-bold text-white">
                No results found for "{searchQuery}"
              </h3>
              <p className="text-xs text-[#888888]">
                Please check the spelling or search for another song, artist, or album.
              </p>
            </div>
          ) : (
            <>
              {/* Top Result + Top Songs Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Top Result Box */}
                {topResult && (
                  <div className="lg:col-span-5 space-y-3">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Top result
                    </h2>

                    <div
                      onClick={() => playTrack(topResult, matchingTracks)}
                      className="p-5 bg-[#181818] hover:bg-[#282828] transition-all rounded-xl cursor-pointer group relative flex flex-col justify-between h-[230px]"
                    >
                      <img
                        src={topResult.coverUrl}
                        alt={topResult.title}
                        className="w-24 h-24 rounded-md object-cover shadow-lg bg-[#242424]"
                      />

                      <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight truncate">
                          {topResult.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#b3b3b3] mt-1">
                          <span className="font-semibold text-white">
                            {topResult.artist}
                          </span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#121212] font-mono text-[10px] text-white">
                            Song
                          </span>
                        </div>
                      </div>

                      {/* Play Button */}
                      <button
                        type="button"
                        className="w-12 h-12 rounded-full bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-xl absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
                      >
                        <Play className="w-5 h-5 fill-black translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Top 4 Matching Songs */}
                <div className={`${topResult ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Songs
                  </h2>

                  <div className="space-y-1">
                    {matchingTracks.slice(0, 4).map((track, i) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={i}
                        contextQueue={matchingTracks}
                        showAlbum={false}
                        showDateAdded={false}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Artists Section */}
              {matchingArtists.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-white tracking-tight mb-4">
                    Artists
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {matchingArtists.map((artist) => (
                      <div
                        key={artist.id}
                        onClick={() => navigate({ type: 'artist', artistId: artist.id })}
                        className="p-4 bg-[#181818] hover:bg-[#282828] transition-all rounded-lg cursor-pointer group flex flex-col items-center text-center"
                      >
                        <img
                          src={artist.avatarUrl}
                          alt={artist.name}
                          className="w-28 h-28 rounded-full object-cover shadow-md mb-3"
                        />
                        <h4 className="font-semibold text-sm text-white truncate w-full">
                          {artist.name}
                        </h4>
                        <span className="text-xs text-[#b3b3b3]">Artist</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Albums Section */}
              {matchingAlbums.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-white tracking-tight mb-4">
                    Albums
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {matchingAlbums.map((album) => (
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
                        <p className="text-xs text-[#b3b3b3] truncate">
                          {album.year} • {album.artist}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
