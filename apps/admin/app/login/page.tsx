export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-center text-2xl font-bold">Seguro Admin</h1>
      <form action="/api/login" method="POST" className="space-y-4">
        <input type="hidden" name="next" value={params.next ?? "/"} />
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
        {params.error ? <p className="text-sm text-red-600">Contraseña incorrecta.</p> : null}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}
