import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 5

interface HomePageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10))
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  const { data: posts, error, count } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching posts:', error)
  }

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bài viết mới nhất</h1>

      {posts && posts.length > 0 ? (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white p-6 rounded-lg shadow border border-gray-200"
              >
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-2xl font-semibold hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p className="text-gray-600 mt-2">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>
                    Bởi{' '}
                    {(post.profiles as { display_name: string | null } | null)
                      ?.display_name || 'Ẩn danh'}
                  </span>
                  <span>•</span>
                  <span>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('vi-VN')
                      : 'Chưa xuất bản'}
                  </span>
                </div>
                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-500"
                >
                  Đọc tiếp →
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <Link
                href={`/?page=${currentPage - 1}`}
                className={`px-4 py-2 rounded-md border text-sm ${
                  currentPage <= 1
                    ? 'pointer-events-none opacity-40 border-gray-200 text-gray-400'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                ← Trước
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/?page=${p}`}
                  className={`px-4 py-2 rounded-md border text-sm ${
                    p === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={`/?page=${currentPage + 1}`}
                className={`px-4 py-2 rounded-md border text-sm ${
                  currentPage >= totalPages
                    ? 'pointer-events-none opacity-40 border-gray-200 text-gray-400'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Sau →
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chưa có bài viết nào.</p>
        </div>
      )}
    </main>
  )
}
