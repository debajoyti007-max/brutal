import React, { useEffect, useRef } from 'react'
import { X, Play, Pause } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

export const LyricsView: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    seekTo,
    togglePlay,
    currentThemeColor,
    goBack
  } = usePlayer()

  const lyrics = currentTrack?.lyrics || [
    'No lyrics available for this track.',
    'Enjoy the instrumental soundscape on Montage Music.'
  ]

  // Calculate roughly which lyric line corresponds to current playback progress
  const linesCount = lyrics.length
  const lineDuration = duration > 0 ? duration / linesCount : 10
  const activeLineIndex = Math.min(
    linesCount - 1,
    Math.max(0, Math.floor(currentTime / lineDuration))
  )

  const activeLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }, [activeLineIndex])

  const handleLineClick = (idx: number) => {
    const targetSeconds = idx * lineDuration
    seekTo(targetSeconds)
  }

  return (
    <div
      className="fixed inset-0 z-40 select-none flex flex-col overflow-hidden transition-colors duration-700"
      style={{
        background: `radial-gradient(ellipse at top left, ${currentThemeColor} 0%, #0d0d0d 65%, #080808 100%)`
      }}
    >
      {/* ── Top Bar Header ── */}
      <div className="h-20 px-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={currentTrack?.coverUrl}
            alt={currentTrack?.title}
            className="w-12 h-12 rounded object-cover shadow-lg bg-[#242424]"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">
              {currentTrack?.title}
            </span>
            <span className="text-xs text-white/70 truncate">
              {currentTrack?.artist}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={goBack}
            title="Exit lyrics"
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Scrollable Karaoke Lyrics Body ── */}
      <div className="flex-1 overflow-y-auto px-8 md:px-24 py-16 space-y-8 md:space-y-12">
        {lyrics.map((line, idx) => {
          const isActive = idx === activeLineIndex
          const isPassed = idx < activeLineIndex

          return (
            <div
              key={idx}
              ref={isActive ? activeLineRef : null}
              onClick={() => handleLineClick(idx)}
              className={`cursor-pointer transition-all duration-300 transform origin-left ${
                isActive
                  ? 'text-white text-3xl sm:text-5xl font-black scale-102 filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]'
                  : isPassed
                  ? 'text-white/60 text-2xl sm:text-4xl font-extrabold hover:text-white/80'
                  : 'text-white/25 text-2xl sm:text-4xl font-extrabold hover:text-white/50'
              }`}
            >
              {line}
            </div>
          )
        })}
      </div>
    </div>
  )
}
