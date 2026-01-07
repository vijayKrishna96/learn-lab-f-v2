import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ border: '2px solid red', padding: '20px' }}>
      <div>{children}</div>
    </div>
  );
}
