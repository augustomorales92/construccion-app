import { FormMessage, Message } from '@/components/form-message'
import SignupForm from './sign-up-form'

export default async function SignUp(props: { searchParams: Promise<Message> }) {
   const searchParams = await props.searchParams
  
    if ("message" in searchParams) {
      return (
        <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
          <FormMessage message={searchParams} />
        </div>
      )
    }
  return <SignupForm searchParams={searchParams} />
}