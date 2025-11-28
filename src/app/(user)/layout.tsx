// /pages/user/layout.tsx
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div>
      <main>
        {children} {/* This will render the content of each individual page */}
      </main>
    </div>
  )
}

export default Layout
