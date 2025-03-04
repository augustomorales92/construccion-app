import { getLoggedInUser } from '@/actions/auth'
import ProfileCard from '@/components/profile/ProfileCard'

export default async function Profile() {
  const user = await getLoggedInUser()

  return (
    <div>
      <ProfileCard user={user} />
    </div>
  )
}
