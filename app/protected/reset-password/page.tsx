import { Message } from '@/components/form-message'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ResetForm from './reset-form'

export default async function ResetPassword(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams
  return (
    <div className="container max-w-2xl py-10 h-custom flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
          Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetForm searchParams={searchParams} />
        </CardContent>
      </Card>
    </div>
  )
}
