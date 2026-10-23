import type { Track } from '../types'

export type AudioEventCallback = {
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onEnded?: () => void
  onPlayStateChange?: (isPlaying: boolean) => void
  onError?: (error: Error) => void
}

class AudioEngine {
  private audio: HTMLAudioElement | null = null
  private callbacks: AudioEventCallback = {}
  private synthContext: AudioContext | null = null
  private synthInterval: number | null = null
  private isUsingSynth: boolean = false
  private currentTrack: Track | null = null
  private isPlaying: boolean = false
  private currentTime: number = 0
  private duration: number = 0
  private volume: number = 0.8
  private isMuted: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio()
      this.audio.preload = 'metadata'
      this.setupListeners()
    }
  }

  public setCallbacks(callbacks: AudioEventCallback) {
    this.callbacks = callbacks
  }

  private setupListeners() {
    if (!this.audio) return

    this.audio.addEventListener('timeupdate', () => {
      if (this.isUsingSynth) return
      this.currentTime = this.audio?.currentTime || 0
      this.duration = this.audio?.duration || this.currentTrack?.duration || 0
      this.callbacks.onTimeUpdate?.(this.currentTime, this.duration)
    })

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio && !isNaN(this.audio.duration) && this.audio.duration > 0) {
        this.duration = this.audio.duration
      } else if (this.currentTrack) {
        this.duration = this.currentTrack.duration
      }
      this.callbacks.onTimeUpdate?.(this.currentTime, this.duration)
    })

    this.audio.addEventListener('play', () => {
      this.isPlaying = true
      this.callbacks.onPlayStateChange?.(true)
    })

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false
      this.callbacks.onPlayStateChange?.(false)
    })

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false
      this.callbacks.onPlayStateChange?.(false)
      this.callbacks.onEnded?.()
    })

    this.audio.addEventListener('error', () => {
      console.warn('Network audio source failed. Falling back to internal procedural audio synthesizer.')
      this.fallbackToSynth()
    })
  }

  public async loadTrack(track: Track, autoPlay: boolean = true) {
    this.currentTrack = track
    this.stopSynth()
    this.isUsingSynth = false
    this.currentTime = 0
    this.duration = track.duration

    if (!this.audio) return

    try {
      this.audio.src = track.audioUrl
      this.audio.volume = this.isMuted ? 0 : this.volume
      if (autoPlay) {
        await this.play()
      }
    } catch {
      this.fallbackToSynth()
      if (autoPlay) {
        this.playSynth()
      }
    }
  }

  public async play() {
    if (this.isUsingSynth) {
      this.playSynth()
      return
    }

    if (!this.audio) return

    try {
      await this.audio.play()
      this.isPlaying = true
      this.callbacks.onPlayStateChange?.(true)
    } catch (e) {
      console.warn('Playback error, switching to procedural synth:', e)
      this.fallbackToSynth()
      this.playSynth()
    }
  }

  public pause() {
    if (this.isUsingSynth) {
      this.pauseSynth()
      return
    }

    if (!this.audio) return
    this.audio.pause()
    this.isPlaying = false
    this.callbacks.onPlayStateChange?.(false)
  }

  public seek(seconds: number) {
    const target = Math.max(0, Math.min(seconds, this.duration))
    this.currentTime = target

    if (this.isUsingSynth) {
      this.callbacks.onTimeUpdate?.(this.currentTime, this.duration)
      return
    }

    if (this.audio) {
      this.audio.currentTime = target
    }
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
    if (this.audio) {
      this.audio.volume = muted ? 0 : this.volume
    }
  }

  // --- Procedural Fallback Synthesizer ---
  private fallbackToSynth() {
    this.isUsingSynth = true
    if (this.audio) {
      this.audio.pause()
      this.audio.removeAttribute('src')
    }
  }

  private playSynth() {
    this.isPlaying = true
    this.callbacks.onPlayStateChange?.(true)

    if (!this.synthContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.synthContext = new AudioCtx()
    }

    if (this.synthContext.state === 'suspended') {
      this.synthContext.resume()
    }

    if (this.synthInterval) {
      clearInterval(this.synthInterval)
    }

    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
    ]
    let chordIdx = 0

    this.synthInterval = window.setInterval(() => {
      this.currentTime += 1
      if (this.currentTime >= this.duration) {
        this.pauseSynth()
        this.callbacks.onEnded?.()
        return
      }

      this.callbacks.onTimeUpdate?.(this.currentTime, this.duration)

      // Play soft mellow harmonic tone if volume > 0 and not muted
      if (this.synthContext && !this.isMuted && this.volume > 0 && this.currentTime % 2 === 0) {
        const chord = chords[chordIdx % chords.length]
        chordIdx++

        chord.forEach((freq) => {
          if (!this.synthContext) return
          const osc = this.synthContext.createOscillator()
          const gain = this.synthContext.createGain()

          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, this.synthContext.currentTime)

          const gainLevel = 0.04 * this.volume
          gain.gain.setValueAtTime(gainLevel, this.synthContext.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.0001, this.synthContext.currentTime + 1.8)

          osc.connect(gain)
          gain.connect(this.synthContext.destination)

          osc.start()
          osc.stop(this.synthContext.currentTime + 1.8)
        })
      }
    }, 1000)
  }

  private pauseSynth() {
    this.isPlaying = false
    this.callbacks.onPlayStateChange?.(false)
    this.stopSynth()
  }

  private stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval)
      this.synthInterval = null
    }
  }

  public getCurrentTime(): number {
    return this.currentTime
  }

  public getDuration(): number {
    return this.duration
  }

  public getIsPlaying(): boolean {
    return this.isPlaying
  }
}

export const audioEngine = new AudioEngine()
