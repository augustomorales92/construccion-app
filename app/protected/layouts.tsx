import ProtectedLayout from '@/components/layout/protectedLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}
