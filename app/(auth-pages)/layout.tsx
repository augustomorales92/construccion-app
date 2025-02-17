export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full flex flex-col gap-12 items-center justify-center my-3">
      {children}
    </div>
  )
}
