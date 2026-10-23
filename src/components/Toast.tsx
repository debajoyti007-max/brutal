import React from 'react'
import { usePlayer } from '../context/PlayerContext'

export const Toast: React.FC = () => {
  const { toastMessage } = usePlayer()

  if (!toastMessage) return null

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-[#1db954] text-black font-semibold text-xs px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-black/10">
        <span>✓</span>
        <span>{toastMessage}</span>
      </div>
    </div>
  )
}
