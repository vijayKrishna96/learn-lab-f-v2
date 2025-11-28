import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ border: '2px solid red', padding: '20px' }}>
      <h2>🧑‍💼 Admin Layout</h2>
      <nav style={{ display: 'flex', gap: '10px' }}>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/users">Manage Users</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}
