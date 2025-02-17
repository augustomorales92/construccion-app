'use client'
import { signUpAction} from '@/app/actions'
import { FormMessage, type Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import RoleSelection from './role-page'

export default function SignupForm({
  searchParams,
}: {
  searchParams: Message
}) {
  const [role, setRole] = useState<string | null>(null)
  const sigUnWithRole = signUpAction.bind(null, role)
  // const sigUnWithRole = signUp.bind(null, role)

  if (!role) {
    return <RoleSelection role={role} setRole={setRole} />
  }

  return (
    <div className="h-full flex justify-center items-center w-full">
      <Card className='w-96 min-h-[70vh]"'>
        <CardHeader>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sign up
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                className="font-medium text-primary hover:underline"
                href="/sign-in"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  minLength={6}
                  required
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  name="confirm-password"
                  placeholder="Confirm your password"
                  minLength={6}
                  required
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex items-center">
                <Checkbox id="terms" name="terms" required />
                <Label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms and Conditions
                  </Link>
                </Label>
              </div>
            </div>

            <SubmitButton
              pendingText="Signing up..."
              formAction={sigUnWithRole}
              className="w-full"
            >
              Sign up
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background  text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
