'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function ResetPasswordForm() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
        return
      }

      router.push('/login?message=Đặt lại mật khẩu thành công! Vui lòng đăng nhập.')
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mật khẩu mới
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
        <p className="mt-1 text-xs text-gray-500">Tối thiểu 6 ký tự</p>
      </div>

      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
          Xác nhận mật khẩu
        </label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
      </button>
    </form>
  )
}
