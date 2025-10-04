'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <>
      {children}
      {!isAdminPage && <Footer />}
    </>
  )
}