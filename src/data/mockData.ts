import type { Track, Album, Artist, Playlist, BrowseCategory } from '../types'

export const TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight Horizon',
    artist: 'Luna Eclipse',
    artistId: 'artist-1',
    album: 'Nocturnal Echoes',
    albumId: 'album-1',
    duration: 214,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    addedAt: '2026-09-12',
    plays: 1420580,
    lyrics: [
      'Neon lights through rainy glass',
      'Shadows drift and gently pass',
      'City breathing in the dark',
      'Searching for a quiet spark',
      'Midnight horizon calling out your name',
      'Nothing stays quite the same',
      'Watch the headlights softly fade',
      'In the promises we made'
    ]
  },
  {
    id: 'track-2',
    title: 'Solar Drift',
    artist: 'Aether Collective',
    artistId: 'artist-2',
    album: 'Atmospheres Vol. 2',
    albumId: 'album-2',
    duration: 188,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=electronic-future-beats-117997.mp3',
    addedAt: '2026-09-15',
    plays: 984320,
    lyrics: [
      'Rise above the golden sun',
      'A new tomorrow has begun',
      'Feel the frequency ignite',
      'Floating through the stellar light',
      'Solar drift across the sky',
      'Moments racing quickly by',
      'Higher ground is where we belong',
      'Echoes of a distant song'
    ]
  },
  {
    id: 'track-3',
    title: 'Velvet Rain',
    artist: 'Kaelen Vance',
    artistId: 'artist-3',
    album: 'Reflections in Grey',
    albumId: 'album-3',
    duration: 245,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    addedAt: '2026-09-20',
    plays: 2310490,
    lyrics: [
      'Drops of water on the sill',
      'Every ticking second still',
      'Cigarettes and memories old',
      'Stories that were never told',
      'Velvet rain softly falling down',
      'Washing out this lonely town',
      'Wrap your jacket round my cold embrace',
      'Time cannot erase this place'
    ]
  },
  {
    id: 'track-4',
    title: 'Urban Pulse',
    artist: 'Nova Soundlab',
    artistId: 'artist-4',
    album: 'Metropolitan High',
    albumId: 'album-4',
    duration: 195,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_7301c27e85.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    addedAt: '2026-09-25',
    plays: 3450120,
    lyrics: [
      'Steel and concrete underground',
      'Rhythm in the train track sound',
      'Turn the bass until it shakes',
      'Living for the chances taken',
      'Can you feel the urban pulse?',
      'Moving forward, no remorse',
      'Skyscrapers touch the clouds above',
      'In a city built for love'
    ]
  },
  {
    id: 'track-5',
    title: 'Golden Hour Memories',
    artist: 'Luna Eclipse',
    artistId: 'artist-1',
    album: 'Nocturnal Echoes',
    albumId: 'album-1',
    duration: 202,
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    addedAt: '2026-10-01',
    plays: 875200,
    lyrics: [
      'Amber glow upon your face',
      'Lost inside a warm embrace',
      'Shadows stretch across the sand',
      'Holding onto your gentle hand',
      'Golden hour never fade away',
      'Wish that we could always stay'
    ]
  },
  {
    id: 'track-6',
    title: 'Deep Chroma',
    artist: 'Aether Collective',
    artistId: 'artist-2',
    album: 'Atmospheres Vol. 2',
    albumId: 'album-2',
    duration: 230,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=electronic-future-beats-117997.mp3',
    addedAt: '2026-10-05',
    plays: 1209300,
    lyrics: [
      'Submerged in cobalt blue',
      'Searching for a clearer view',
      'Vibrations deep within the mind',
      'Treasures that we left behind',
      'Deep chroma, endless sea',
      'Setting every thought free'
    ]
  },
  {
    id: 'track-7',
    title: 'Slow Cinema',
    artist: 'Kaelen Vance',
    artistId: 'artist-3',
    album: 'Reflections in Grey',
    albumId: 'album-3',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    addedAt: '2026-10-08',
    plays: 1540900,
    lyrics: [
      'Black and white on 35 millimeter',
      'Every silhouette grew sweeter',
      'No dialogue, just acoustic strings',
      'The quiet weight that silence brings'
    ]
  },
  {
    id: 'track-8',
    title: 'Hyperdrive',
    artist: 'Nova Soundlab',
    artistId: 'artist-4',
    album: 'Metropolitan High',
    albumId: 'album-4',
    duration: 178,
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_7301c27e85.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    addedAt: '2026-10-12',
    plays: 2890100,
    lyrics: [
      'Countdown reaching zero speed',
      'Adrenaline is all we need',
      'Jump the light barrier and go',
      'Leaving all we used to know'
    ]
  }
]

export const ALBUMS: Album[] = [
  {
    id: 'album-1',
    title: 'Nocturnal Echoes',
    artist: 'Luna Eclipse',
    artistId: 'artist-1',
    year: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    themeColor: '#3d2b56',
    genre: 'Downtempo / Lofi',
    tracks: [TRACKS[0], TRACKS[4]]
  },
  {
    id: 'album-2',
    title: 'Atmospheres Vol. 2',
    artist: 'Aether Collective',
    artistId: 'artist-2',
    year: 2025,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    themeColor: '#1a365d',
    genre: 'Ambient Electronic',
    tracks: [TRACKS[1], TRACKS[5]]
  },
  {
    id: 'album-3',
    title: 'Reflections in Grey',
    artist: 'Kaelen Vance',
    artistId: 'artist-3',
    year: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    themeColor: '#4a2c2c',
    genre: 'Indie Folk / Acoustic',
    tracks: [TRACKS[2], TRACKS[6]]
  },
  {
    id: 'album-4',
    title: 'Metropolitan High',
    artist: 'Nova Soundlab',
    artistId: 'artist-4',
    year: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    themeColor: '#2b4c3f',
    genre: 'Synthwave / Electronic',
    tracks: [TRACKS[3], TRACKS[7]]
  }
]

export const ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    name: 'Luna Eclipse',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    headerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: 2450890,
    verified: true,
    bio: 'Electronic and lofi producer blending nostalgic tape saturation, Rhodes keyboards, and cinematic soundscapes.',
    topTrackIds: ['track-1', 'track-5'],
    albumIds: ['album-1']
  },
  {
    id: 'artist-2',
    name: 'Aether Collective',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    headerUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: 1820400,
    verified: true,
    bio: 'An experimental trio creating expansive ambient textures, modular synth sweeps, and rhythmic sound design.',
    topTrackIds: ['track-2', 'track-6'],
    albumIds: ['album-2']
  },
  {
    id: 'artist-3',
    name: 'Kaelen Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    headerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: 3105700,
    verified: true,
    bio: 'Singer-songwriter and multi-instrumentalist from the Pacific Northwest exploring intimate storytelling and fingerstyle guitar.',
    topTrackIds: ['track-3', 'track-7'],
    albumIds: ['album-3']
  },
  {
    id: 'artist-4',
    name: 'Nova Soundlab',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
    headerUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: 4290100,
    verified: true,
    bio: 'Chart-topping electronic music production outfit known for punchy basslines, club-ready hooks, and futuristic anthems.',
    topTrackIds: ['track-4', 'track-8'],
    albumIds: ['album-4']
  }
]

export const PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-today-top',
    title: "Today's Top Hits",
    description: 'The hottest tracks right now across all genres. Cover: Luna Eclipse.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    themeColor: '#1e3a5f',
    owner: 'Montage Curators',
    trackIds: ['track-1', 'track-4', 'track-2', 'track-8', 'track-3'],
    createdAt: '2026-10-01'
  },
  {
    id: 'playlist-deep-focus',
    title: 'Deep Focus & Flow',
    description: 'Keep calm and focus with ambient beats and minimal melodies.',
    coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop',
    themeColor: '#2b3a4a',
    owner: 'Montage Ambient',
    trackIds: ['track-2', 'track-6', 'track-1', 'track-7'],
    createdAt: '2026-10-05'
  },
  {
    id: 'playlist-midnight-chill',
    title: 'Midnight Chillout',
    description: 'Late night sessions, mellow frequencies, and intimate vocals.',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    themeColor: '#3c244c',
    owner: 'Montage Editorial',
    trackIds: ['track-3', 'track-5', 'track-7', 'track-1'],
    createdAt: '2026-10-10'
  },
  {
    id: 'playlist-electronic-drive',
    title: 'Electronic Pulse',
    description: 'High octane synthesizers and deep sub bass for highway night drives.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    themeColor: '#1f4837',
    owner: 'Montage Club',
    trackIds: ['track-4', 'track-8', 'track-2'],
    createdAt: '2026-10-14'
  }
]

export const BROWSE_CATEGORIES: BrowseCategory[] = [
  { id: 'cat-pop', name: 'Pop', color: '#8d67ab', coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop' },
  { id: 'cat-hiphop', name: 'Hip-Hop', color: '#ba5d07', coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop' },
  { id: 'cat-indie', name: 'Indie & Alt', color: '#608108', coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400&auto=format&fit=crop' },
  { id: 'cat-electronic', name: 'Electronic', color: '#148a08', coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop' },
  { id: 'cat-chill', name: 'Chill & Lofi', color: '#27856a', coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop' },
  { id: 'cat-rock', name: 'Rock & Metal', color: '#e91429', coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&auto=format&fit=crop' },
  { id: 'cat-focus', name: 'Focus & Study', color: '#503750', coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400&auto=format&fit=crop' },
  { id: 'cat-sleep', name: 'Sleep & Ambient', color: '#1e3264', coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop' }
]
