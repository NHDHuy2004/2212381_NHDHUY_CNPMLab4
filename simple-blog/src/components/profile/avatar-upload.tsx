'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface AvatarUploadProps {
  userId: string
  currentUrl: string
  onUpload: (url: string) => void
}

export function AvatarUpload({ userId, currentUrl, onUpload }: AvatarUploadProps) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const ext = file.name.split('.').pop()
    const filePath = `${userId}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    onUpload(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
        {currentUrl ? (
          <Image
            src={currentUrl}
            alt="Avatar"
            width={80}
            height={80}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <span className="text-gray-400 text-3xl">👤</span>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? 'Đang tải...' : 'Chọn ảnh'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <p className="text-gray-400 text-xs mt-1">JPG, PNG, GIF tối đa 2MB</p>
      </div>
    </div>
  )
}
