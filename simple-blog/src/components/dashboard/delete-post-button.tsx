'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface DeletePostButtonProps {
  postId: string
  postTitle: string
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa bài viết "${postTitle}"? Hành động này không thể hoàn tác.`
    )
    if (!confirmed) return

    setLoading(true)
    try {
      const { data: deleted, error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .select()

      if (error) throw error
      if (!deleted || deleted.length === 0)
        throw new Error('Không có quyền xóa bài viết này (RLS)')
      router.refresh()
    } catch (err) {
      alert((err as { message?: string })?.message || 'Có lỗi xảy ra khi xóa bài viết')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-500 px-3 py-1 text-sm disabled:opacity-50"
    >
      {loading ? 'Đang xóa...' : 'Xóa'}
    </button>
  )
}
