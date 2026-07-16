import Link from "next/link";

/**
 * Chrome (sidebar + logout) for authenticated pages only. Kept in a route
 * group separate from /login so the login page's own submit button is
 * never shadowed by the "Cerrar sesion" button in this sidebar.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-4">
        <p className="mb-6 px-2 text-lg font-bold">Seguro Admin</p>
        <nav className="space-y-1 text-sm">
          <Link href="/" className="block rounded-md px-2 py-2 hover:bg-slate-100">
            Dashboard
          </Link>
          <Link href="/leads" className="block rounded-md px-2 py-2 hover:bg-slate-100">
            Leads
          </Link>
          <Link href="/partners" className="block rounded-md px-2 py-2 hover:bg-slate-100">
            Partners
          </Link>
        </nav>
        <form action="/api/logout" method="POST" className="mt-8 px-2">
          <button type="submit" className="text-sm text-slate-500 hover:text-slate-800">
            Cerrar sesion
          </button>
        </form>
      </aside>
      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
