import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
    id: string
    email: string
    name: string | null
    createdAt: string
    updatedAt: string
    role: string
  }

export default function ProfileCard({ user }: { user: User }) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="flex flex-col items-center pt-6">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile picture" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
        <p className="text-sm text-muted-foreground mb-1">{user.role}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </CardContent>
    </Card>
  )
}