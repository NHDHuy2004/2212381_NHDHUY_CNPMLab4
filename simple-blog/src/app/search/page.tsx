import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  const supabase = await createClient()

  let posts = null
  if (query) {
    const { data } = await supabase
      .from('posts')
      .select(`
        id, title, slug, excerpt, published_at,
        profiles ( display_name )
      `)
      .eq('status', 'published')
      .textSearch('fts', query, { config: 'simple' })
      .order('published_at', { ascending: false })
      .limit(20)
    posts = data
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tìm kiếm</h1>

      <form method="get" action="/search" className="mb-8">
        <div className="flex gap-2">
          <input
            name="q"
            type="text"
            defaultValue={query}
            placeholder="Nhập từ khóa..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tìm
          </button>
        </div>
      </form>

      {query && (
        <p className="text-gray-500 mb-6 text-sm">
          Kết quả tìm kiếm cho: <strong>&ldquo;{query}&rdquo;</strong>
          {posts ? ` — ${posts.length} bài viết` : ''}
        </p>
      )}

      {posts && posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white p-6 rounded-lg shadow border border-gray-200"
            >
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              {post.excerpt && (
                <p className="text-gray-600 mt-2 text-sm">{post.excerpt}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>
                  Bởi{' '}
                  {(post.profiles as unknown as { display_name: string | null } | null)
                    ?.display_name || 'Ẩn danh'}
                </span>
                {post.published_at && (
                  <>
                    <span>•</span>
                    <span>
                      {new Date(post.published_at).toLocaleDateString('vi-VN')}
                    </span>
                  </>
                )}
              </div>
              <Link
                href={`/posts/${post.slug}`}
                className="inline-block mt-3 text-blue-600 hover:text-blue-500 text-sm"
              >
                Đọc tiếp →
              </Link>
            </article>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Không tìm thấy bài viết nào phù hợp.</p>
        </div>
      ) : null}
    </main>
  )
}
