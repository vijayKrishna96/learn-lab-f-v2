
import InstructorHeader from '@/components/navbar/InstructorNavbar';
import Link from 'next/link';

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <InstructorHeader/>
      <main>{children}</main>
    </div>
  );
}
