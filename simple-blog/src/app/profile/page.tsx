import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Tạo profile nếu chưa tồn tại (trigger có thể không chạy)
  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      display_name: user.user_metadata?.display_name || user.email,
    })
    redirect('/profile')
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hồ sơ của tôi</h1>
      <ProfileForm profile={profile} />
    </main>
  )
}
