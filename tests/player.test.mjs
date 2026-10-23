import test from 'node:test'
import assert from 'node:assert/strict'

// Test Mock Catalog Integrity
test('Catalog Integrity Test', async (t) => {
  await t.test('All tracks must have non-empty required fields and positive duration', async () => {
    // Dynamic import to test mock data logic
    const { TRACKS, ALBUMS, ARTISTS, PLAYLISTS } = await import('../src/data/mockData.ts')

    assert.ok(TRACKS.length >= 8, 'Must have at least 8 tracks')
    for (const track of TRACKS) {
      assert.ok(track.id, 'Track must have an id')
      assert.ok(track.title, 'Track must have a title')
      assert.ok(track.artist, 'Track must have an artist')
      assert.ok(track.album, 'Track must have an album')
      assert.ok(track.duration > 0, 'Track duration must be positive')
      assert.ok(track.coverUrl.startsWith('http'), 'Track coverUrl must be valid HTTP URL')
      assert.ok(track.audioUrl.startsWith('http'), 'Track audioUrl must be valid HTTP URL')
    }

    assert.ok(ALBUMS.length >= 4, 'Must have at least 4 albums')
    assert.ok(ARTISTS.length >= 4, 'Must have at least 4 artists')
    assert.ok(PLAYLISTS.length >= 4, 'Must have at least 4 playlists')
  })
})

// Test Formatting Utilities
test('Formatting Utilities Test', async (t) => {
  const { formatTime, formatTotalDuration, getGreeting } = await import('../src/utils/format.ts')

  await t.test('formatTime correctly formats seconds', () => {
    assert.equal(formatTime(0), '0:00')
    assert.equal(formatTime(65), '1:05')
    assert.equal(formatTime(214), '3:34')
    assert.equal(formatTime(3600), '60:00')
    assert.equal(formatTime(-5), '0:00')
  })

  await t.test('formatTotalDuration formats hours and minutes', () => {
    assert.equal(formatTotalDuration(120), '2 min')
    assert.equal(formatTotalDuration(3660), '1 hr 1 min')
  })

  await t.test('getGreeting returns valid time-of-day greeting', () => {
    const greeting = getGreeting()
    assert.ok(['Good morning', 'Good afternoon', 'Good evening'].includes(greeting))
  })
})

// Test Queue & Playback Logic
test('Queue State Machine Test', async (t) => {
  const queue = [
    { id: '1', title: 'Song 1' },
    { id: '2', title: 'Song 2' },
    { id: '3', title: 'Song 3' }
  ]

  let currentIndex = 0

  function nextTrack(repeatMode = 'off', isShuffle = false) {
    if (repeatMode === 'one') return currentIndex
    if (isShuffle) return Math.floor(Math.random() * queue.length)
    let nextIdx = currentIndex + 1
    if (nextIdx >= queue.length) {
      return repeatMode === 'all' ? 0 : -1 // -1 means playback stopped
    }
    return nextIdx
  }

  function prevTrack(currentTime = 0) {
    if (currentTime > 3) return currentIndex // restart song
    return currentIndex === 0 ? queue.length - 1 : currentIndex - 1
  }

  await t.test('Next track advances sequentially', () => {
    currentIndex = 0
    currentIndex = nextTrack('off')
    assert.equal(currentIndex, 1)
    currentIndex = nextTrack('off')
    assert.equal(currentIndex, 2)
    currentIndex = nextTrack('off')
    assert.equal(currentIndex, -1) // stops at end
  })

  await t.test('Next track loops when repeat is all', () => {
    currentIndex = 2
    currentIndex = nextTrack('all')
    assert.equal(currentIndex, 0)
  })

  await t.test('Repeat one stays on current song', () => {
    currentIndex = 1
    currentIndex = nextTrack('one')
    assert.equal(currentIndex, 1)
  })

  await t.test('Previous track restarts if currentTime > 3s', () => {
    currentIndex = 1
    const result = prevTrack(5)
    assert.equal(result, 1)
  })

  await t.test('Previous track goes to preceding track if currentTime <= 3s', () => {
    currentIndex = 1
    const result = prevTrack(1)
    assert.equal(result, 0)
  })
})
