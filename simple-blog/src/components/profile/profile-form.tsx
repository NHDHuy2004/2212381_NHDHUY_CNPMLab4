'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/database'
import { AvatarUpload } from './avatar-upload'

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const supabase = createClient()
  const [displayName, setDisplayName] = useState(profile.display_name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, avatar_url: avatarUrl })
      .eq('id', profile.id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
          Cập nhật profile thành công!
        </div>
      )}

      <div className="flex flex-col items-start gap-4">
        <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
        <AvatarUpload
          userId={profile.id}
          currentUrl={avatarUrl}
          onUpload={(url) => setAvatarUrl(url)}
        />
      </div>

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
          Tên hiển thị
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nhập tên hiển thị"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="mt-1 text-gray-500 text-sm">{profile.id}</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </form>
  )
}
