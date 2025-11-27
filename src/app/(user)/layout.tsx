// /pages/user/layout.tsx
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div>
      <header>
        <h1>User Dashboard</h1>
        {/* You can add navigation links here */}
      </header>
      <main>
        {children} {/* This will render the content of each individual page */}
      </main>
    </div>
  )
}

export default Layout
