import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { Track, Playlist, ViewType, RepeatMode } from '../types'
import { TRACKS, PLAYLISTS } from '../data/mockData'
import { audioEngine } from '../services/audioEngine'

interface PlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isShuffle: boolean
  repeatMode: RepeatMode
  queue: Track[]
  queueIndex: number
  likedTrackIds: Set<string>
  customPlaylists: Playlist[]
  currentView: ViewType
  canGoBack: boolean
  canGoForward: boolean
  isNowPlayingExpanded: boolean
  isQueueOpen: boolean
  playTrack: (track: Track, newQueue?: Track[]) => void
  togglePlay: () => void
  nextTrack: () => void
  prevTrack: () => void
  seekTo: (seconds: number) => void
  setVolume: (vol: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  toggleLike: (trackId: string) => void
  createPlaylist: (title: string, description?: string) => string
  addTrackToPlaylist: (playlistId: string, trackId: string) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  navigate: (view: ViewType) => void
  goBack: () => void
  goForward: () => void
  setIsNowPlayingExpanded: (open: boolean) => void
  setIsQueueOpen: (open: boolean) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(TRACKS[0])
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(TRACKS[0].duration)
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('montage_volume')
    return saved ? parseFloat(saved) : 0.8
  })
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isShuffle, setIsShuffle] = useState<boolean>(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off')
  const [queue, setQueue] = useState<Track[]>(TRACKS)
  const [queueIndex, setQueueIndex] = useState<number>(0)

  // Navigation History
  const [history, setHistory] = useState<ViewType[]>([{ type: 'home' }])
  const [historyIndex, setHistoryIndex] = useState<number>(0)

  // Panels
  const [isNowPlayingExpanded, setIsNowPlayingExpanded] = useState<boolean>(false)
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false)

  // Liked Tracks
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('montage_liked_tracks')
      if (saved) return new Set(JSON.parse(saved))
    } catch {
      // fallback
    }
    return new Set(['track-1', 'track-3', 'track-5'])
  })

  // Playlists
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('montage_custom_playlists')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return PLAYLISTS
  })

  // Current View
  const currentView = history[historyIndex] || { type: 'home' }
  const canGoBack = historyIndex > 0
  const canGoForward = historyIndex < history.length - 1

  const navigate = useCallback((view: ViewType) => {
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1)
      return [...updated, view]
    })
    setHistoryIndex((prev) => prev + 1)
  }, [historyIndex])

  const goBack = useCallback(() => {
    if (canGoBack) {
      setHistoryIndex((prev) => prev - 1)
    }
  }, [canGoBack])

  const goForward = useCallback(() => {
    if (canGoForward) {
      setHistoryIndex((prev) => prev + 1)
    }
  }, [canGoForward])

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track)
    if (newQueue) {
      setQueue(newQueue)
      const idx = newQueue.findIndex((t) => t.id === track.id)
      setQueueIndex(idx >= 0 ? idx : 0)
    } else {
      const idx = queue.findIndex((t) => t.id === track.id)
      if (idx >= 0) {
        setQueueIndex(idx)
      } else {
        setQueue((prev) => [track, ...prev])
        setQueueIndex(0)
      }
    }
    audioEngine.loadTrack(track, true)
  }, [queue])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioEngine.pause()
    } else {
      if (currentTrack) {
        audioEngine.play()
      } else if (queue.length > 0) {
        playTrack(queue[0])
      }
    }
  }, [isPlaying, currentTrack, queue, playTrack])

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return

    if (repeatMode === 'one' && currentTrack) {
      audioEngine.seek(0)
      audioEngine.play()
      return
    }

    let nextIdx = queueIndex + 1
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length)
    }

    if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0
      } else {
        audioEngine.pause()
        return
      }
    }

    setQueueIndex(nextIdx)
    const next = queue[nextIdx]
    setCurrentTrack(next)
    audioEngine.loadTrack(next, true)
  }, [queue, queueIndex, isShuffle, repeatMode, currentTrack])

  const prevTrack = useCallback(() => {
    if (currentTime > 3) {
      audioEngine.seek(0)
      return
    }

    if (queue.length === 0) return

    let prevIdx = queueIndex - 1
    if (prevIdx < 0) {
      prevIdx = queue.length - 1
    }

    setQueueIndex(prevIdx)
    const prev = queue[prevIdx]
    setCurrentTrack(prev)
    audioEngine.loadTrack(prev, true)
  }, [currentTime, queue, queueIndex])

  const seekTo = useCallback((seconds: number) => {
    audioEngine.seek(seconds)
    setCurrentTime(seconds)
  }, [])

  const setVolume = useCallback((val: number) => {
    setVolumeState(val)
    localStorage.setItem('montage_volume', val.toString())
    audioEngine.setVolume(val)
    if (val > 0 && isMuted) {
      setIsMuted(false)
      audioEngine.setMuted(false)
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    const nextMute = !isMuted
    setIsMuted(nextMute)
    audioEngine.setMuted(nextMute)
  }, [isMuted])

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev)
  }, [])

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all'
      if (prev === 'all') return 'one'
      return 'off'
    })
  }, [])

  const toggleLike = useCallback((trackId: string) => {
    setLikedTrackIds((prev) => {
      const next = new Set(prev)
      if (next.has(trackId)) {
        next.delete(trackId)
      } else {
        next.add(trackId)
      }
      localStorage.setItem('montage_liked_tracks', JSON.stringify(Array.from(next)))
      return next
    })
  }, [])

  const createPlaylist = useCallback((title: string, description?: string) => {
    const newId = `playlist-custom-${Date.now()}`
    const newPlaylist: Playlist = {
      id: newId,
      title: title.trim() || 'My Playlist #' + (customPlaylists.length + 1),
      description: description || 'Created by you on Montage Music.',
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
      themeColor: '#1db954',
      owner: 'You',
      trackIds: [],
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setCustomPlaylists((prev) => {
      const next = [newPlaylist, ...prev]
      localStorage.setItem('montage_custom_playlists', JSON.stringify(next))
      return next
    })

    return newId
  }, [customPlaylists.length])

  const addTrackToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setCustomPlaylists((prev) => {
      const next = prev.map((p) => {
        if (p.id === playlistId && !p.trackIds.includes(trackId)) {
          return { ...p, trackIds: [...p.trackIds, trackId] }
        }
        return p
      })
      localStorage.setItem('montage_custom_playlists', JSON.stringify(next))
      return next
    })
  }, [])

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setCustomPlaylists((prev) => {
      const next = prev.map((p) => {
        if (p.id === playlistId) {
          return { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) }
        }
        return p
      })
      localStorage.setItem('montage_custom_playlists', JSON.stringify(next))
      return next
    })
  }, [])

  // Audio Engine Event Hookup
  useEffect(() => {
    audioEngine.setCallbacks({
      onTimeUpdate: (cur, dur) => {
        setCurrentTime(cur)
        if (dur > 0) setDuration(dur)
      },
      onPlayStateChange: (state) => {
        setIsPlaying(state)
      },
      onEnded: () => {
        nextTrack()
      }
    })
  }, [nextTrack])

  // Keyboard Shortcuts (Space to play/pause, arrows to seek)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        seekTo(Math.min(duration, currentTime + 5))
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        seekTo(Math.max(0, currentTime - 5))
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, seekTo, duration, currentTime, toggleMute])

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      queue,
      queueIndex,
      likedTrackIds,
      customPlaylists,
      currentView,
      canGoBack,
      canGoForward,
      isNowPlayingExpanded,
      isQueueOpen,
      playTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      seekTo,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeat,
      toggleLike,
      createPlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      navigate,
      goBack,
      goForward,
      setIsNowPlayingExpanded,
      setIsQueueOpen
    }),
    [
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      queue,
      queueIndex,
      likedTrackIds,
      customPlaylists,
      currentView,
      canGoBack,
      canGoForward,
      isNowPlayingExpanded,
      isQueueOpen,
      playTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      seekTo,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeat,
      toggleLike,
      createPlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      navigate,
      goBack,
      goForward
    ]
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
