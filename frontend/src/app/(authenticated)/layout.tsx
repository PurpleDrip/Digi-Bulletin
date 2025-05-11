
// This is a basic authenticated layout.
// You might want to redirect to /home or /dashboard based on user role here,
// or handle auth state more robustly.

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
