import React, { useState } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  ListMusic,
  Maximize2,
  SlidersHorizontal,
  Mic2
} from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { formatTime } from '../utils/format'

export const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    likedTrackIds,
    isNowPlayingExpanded,
    isQueueOpen,
    currentView,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleLike,
    setIsNowPlayingExpanded,
    setIsQueueOpen,
    navigate
  } = usePlayer()

  const [isScrubbing, setIsScrubbing] = useState(false)
  const [scrubValue, setScrubValue] = useState(0)

  const progressPercent = duration > 0 ? ((isScrubbing ? scrubValue : currentTime) / duration) * 100 : 0
  const volumePercent = isMuted ? 0 : volume * 100

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrubValue(parseFloat(e.target.value))
  }

  const handleSeekStart = () => {
    setIsScrubbing(true)
    setScrubValue(currentTime)
  }

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setIsScrubbing(false)
    const target = parseFloat((e.target as HTMLInputElement).value)
    seekTo(target)
  }

  const isLiked = currentTrack ? likedTrackIds.has(currentTrack.id) : false
  const isLyricsActive = currentView.type === 'lyrics'

  return (
    <footer className="h-[90px] bg-[#121212] border-t border-[#242424] px-4 flex items-center justify-between select-none fixed bottom-0 left-0 right-0 z-40">
      {/* ── Left: Current Track Information ── */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[180px]">
        {currentTrack ? (
          <>
            <div
              onClick={() => setIsNowPlayingExpanded(!isNowPlayingExpanded)}
              className="relative w-14 h-14 rounded overflow-hidden shrink-0 cursor-pointer group shadow-sm bg-[#282828]"
            >
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex flex-col min-w-0 pr-2">
              <span
                onClick={() => {
                  if (currentTrack.albumId) {
                    navigate({ type: 'album', albumId: currentTrack.albumId })
                  }
                }}
                className="text-sm font-semibold text-white truncate cursor-pointer hover:underline"
              >
                {currentTrack.title}
              </span>
              <span
                onClick={() => {
                  if (currentTrack.artistId) {
                    navigate({ type: 'artist', artistId: currentTrack.artistId })
                  }
                }}
                className="text-xs text-[#b3b3b3] truncate cursor-pointer hover:underline hover:text-white"
              >
                {currentTrack.artist}
              </span>
            </div>

            <button
              type="button"
              onClick={() => toggleLike(currentTrack.id)}
              title={isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
              className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  isLiked ? 'text-[#1db954] fill-[#1db954]' : ''
                }`}
              />
            </button>
          </>
        ) : (
          <span className="text-xs text-[#666666]">No track loaded</span>
        )}
      </div>

      {/* ── Center: Transport Controls & Scrubber ── */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        {/* Buttons Row */}
        <div className="flex items-center gap-5">
          {/* Shuffle */}
          <button
            type="button"
            onClick={toggleShuffle}
            title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
            className={`p-1 transition-colors relative cursor-pointer ${
              isShuffle ? 'text-[#1db954]' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && (
              <span className="w-1 h-1 bg-[#1db954] rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={prevTrack}
            title="Previous track"
            className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play / Pause Circular Button */}
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-8 h-8 rounded-full bg-white hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-md transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black translate-x-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={nextTrack}
            title="Next track"
            className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={cycleRepeat}
            title={`Repeat: ${repeatMode}`}
            className={`p-1 transition-colors relative cursor-pointer ${
              repeatMode !== 'off' ? 'text-[#1db954]' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== 'off' && (
              <span className="w-1 h-1 bg-[#1db954] rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </button>
        </div>

        {/* Timeline Progress Bar */}
        <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-[#b3b3b3]">
          <span className="w-9 text-right tabular-nums">
            {formatTime(isScrubbing ? scrubValue : currentTime)}
          </span>

          <div className="relative flex-1 flex items-center h-4 group">
            {/* Custom Track Background */}
            <div className="absolute left-0 right-0 h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-[#1db954] transition-colors"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={isScrubbing ? scrubValue : currentTime}
              onChange={handleSeekChange}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              className="w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>

          <span className="w-9 text-left tabular-nums text-[#6a6a6a]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* ── Right: Secondary Controls (Lyrics, Queue, Fullscreen, Volume) ── */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
        {/* Karaoke Fullscreen Lyrics Toggle */}
        <button
          type="button"
          onClick={() => {
            if (isLyricsActive) {
              navigate({ type: 'home' })
            } else {
              navigate({ type: 'lyrics' })
            }
          }}
          title="Karaoke Lyrics"
          className={`p-1.5 transition-colors cursor-pointer ${
            isLyricsActive ? 'text-[#1db954]' : 'text-[#b3b3b3] hover:text-white'
          }`}
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Now Playing Expanded Toggle */}
        <button
          type="button"
          onClick={() => setIsNowPlayingExpanded(!isNowPlayingExpanded)}
          title="Now playing view"
          className={`p-1.5 transition-colors cursor-pointer ${
            isNowPlayingExpanded ? 'text-[#1db954]' : 'text-[#b3b3b3] hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Queue Drawer Toggle */}
        <button
          type="button"
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          title="Queue"
          className={`p-1.5 transition-colors relative cursor-pointer ${
            isQueueOpen ? 'text-[#1db954]' : 'text-[#b3b3b3] hover:text-white'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          {isQueueOpen && (
            <span className="w-1 h-1 bg-[#1db954] rounded-full absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
          )}
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-2 group w-32">
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="relative flex-1 flex items-center h-3">
            <div className="absolute left-0 right-0 h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-[#1db954] transition-colors"
                style={{ width: `${volumePercent}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
