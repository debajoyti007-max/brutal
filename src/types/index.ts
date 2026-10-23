export interface Track {
  id: string
  title: string
  artist: string
  artistId: string
  album: string
  albumId: string
  duration: number // in seconds
  coverUrl: string
  audioUrl: string
  addedAt?: string
  plays?: number
  lyrics?: string[]
}

export interface Album {
  id: string
  title: string
  artist: string
  artistId: string
  year: number
  coverUrl: string
  themeColor: string
  tracks: Track[]
  genre: string
}

export interface Artist {
  id: string
  name: string
  avatarUrl: string
  headerUrl: string
  monthlyListeners: number
  bio: string
  verified: boolean
  topTrackIds: string[]
  albumIds: string[]
}

export interface Playlist {
  id: string
  title: string
  description: string
  coverUrl: string
  themeColor: string
  owner: string
  trackIds: string[]
  isCustom?: boolean
  createdAt: string
}

export interface BrowseCategory {
  id: string
  name: string
  color: string
  coverUrl: string
}

export type ViewType = 
  | { type: 'home' }
  | { type: 'search' }
  | { type: 'library' }
  | { type: 'playlist'; playlistId: string }
  | { type: 'album'; albumId: string }
  | { type: 'artist'; artistId: string }
  | { type: 'liked-songs' }

export type RepeatMode = 'off' | 'all' | 'one'
