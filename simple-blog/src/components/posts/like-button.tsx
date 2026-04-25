'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LikeButtonProps {
  postId: string
  initialCount: number
  initialLiked: boolean
  userId: string | null
}

export function LikeButton({ postId, initialCount, initialLiked, userId }: LikeButtonProps) {
  const supabase = createClient()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    if (!userId) {
      window.location.href = '/login'
      return
    }
    setLoading(true)

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
      setLiked(false)
      setCount((c) => c - 1)
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: userId })
      setLiked(true)
      setCount((c) => c + 1)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
        liked
          ? 'bg-red-50 border-red-300 text-red-600'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
      } disabled:opacity-50`}
    >
      <span className="text-lg">{liked ? '❤️' : '🤍'}</span>
      <span className="text-sm font-medium">{count}</span>
    </button>
  )
}
