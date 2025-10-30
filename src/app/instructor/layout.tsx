import Link from 'next/link';

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ border: '2px solid green', padding: '20px' }}>
      <h2>🧑‍🏫 Instructor Layout</h2>
      <nav style={{ display: 'flex', gap: '10px' }}>
        <Link href="/instructor">Dashboard</Link>
        <Link href="/instructor/courses">Courses</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}
