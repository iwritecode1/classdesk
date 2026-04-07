import { Sidebar, MobileNav } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-0 md:pl-64 transition-all duration-200">
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
