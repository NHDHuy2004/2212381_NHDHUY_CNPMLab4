import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <Link href="/" className="text-xl font-bold text-gray-900 shrink-0">
            Simple Blog
          </Link>

          {/* Search bar */}
          <form method="get" action="/search" className="flex-1 max-w-sm">
            <input
              name="q"
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          <nav className="flex items-center gap-4 shrink-0">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
              Trang chủ
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Profile
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    Đăng xuất
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
