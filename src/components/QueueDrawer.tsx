import React from 'react'
import { X, Play, ListOrdered } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { formatTime } from '../utils/format'

export const QueueDrawer: React.FC = () => {
  const {
    currentTrack,
    queue,
    queueIndex,
    isQueueOpen,
    setIsQueueOpen,
    playTrack
  } = usePlayer()

  if (!isQueueOpen) return null

  const upcomingTracks = queue.slice(queueIndex + 1)

  return (
    <aside className="w-80 bg-[#121212] border-l border-[#242424] flex flex-col h-full shrink-0 select-none overflow-y-auto text-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between sticky top-0 bg-[#121212]/95 backdrop-blur-md z-10 border-b border-[#242424]">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-[#1db954]" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Play Queue
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsQueueOpen(false)}
          title="Close queue"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#b3b3b3] hover:text-white hover:bg-[#242424] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Currently Playing Card */}
        {currentTrack && (
          <div>
            <span className="text-[11px] font-bold text-[#b3b3b3] uppercase tracking-wider block mb-2">
              Now Playing
            </span>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#242424] border border-[#333333]">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded object-cover shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-[#1db954] truncate">
                  {currentTrack.title}
                </span>
                <span className="text-xs text-[#b3b3b3] truncate">
                  {currentTrack.artist}
                </span>
              </div>
              <span className="text-xs text-[#b3b3b3] font-mono shrink-0">
                {formatTime(currentTrack.duration)}
              </span>
            </div>
          </div>
        )}

        {/* Next Up Tracks List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#b3b3b3] uppercase tracking-wider">
              Next Up
            </span>
            <span className="text-xs text-[#888888]">
              {upcomingTracks.length} songs
            </span>
          </div>

          {upcomingTracks.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#666666]">
              No more tracks in queue
            </div>
          ) : (
            <div className="space-y-1">
              {upcomingTracks.map((track, i) => (
                <div
                  key={`${track.id}-${i}`}
                  onClick={() => playTrack(track, queue)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <span className="text-xs text-[#666666] w-4 text-center group-hover:hidden">
                    {i + 1}
                  </span>
                  <div className="w-4 hidden group-hover:flex items-center justify-center text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover shrink-0 bg-[#242424]"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-white truncate">
                      {track.title}
                    </span>
                    <span className="text-[11px] text-[#b3b3b3] truncate">
                      {track.artist}
                    </span>
                  </div>
                  <span className="text-xs text-[#b3b3b3] font-mono shrink-0">
                    {formatTime(track.duration)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
