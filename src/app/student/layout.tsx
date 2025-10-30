import Link from 'next/link'
import React, { ReactNode } from 'react'

type StudentLayoutProps = {
  children: ReactNode;
};

type Props = {}

export default function Layout({children}: StudentLayoutProps) {
  return (
     <div style={{ border: '2px solid blue', padding: '20px' }}>
      <h2>🎓 Student Layout</h2>
      <nav style={{ display: 'flex', gap: '10px' }}>
        <Link href="/student">Dashboard</Link>
        <Link href="/student/profile">Profile</Link>
      </nav>
      <div>{children}</div>
    </div>
  )
}