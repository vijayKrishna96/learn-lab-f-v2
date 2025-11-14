
import StudentHeader from '@/components/navbar/StudentNavbar';
import Link from 'next/link'
import React, { ReactNode } from 'react'

type StudentLayoutProps = {
  children: ReactNode;
};

type Props = {}

export default function Layout({children}: StudentLayoutProps) {
  return (
     <div>
      <StudentHeader />
      <main>{children}</main>
    </div>
  )
}