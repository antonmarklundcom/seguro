import Link from "next/link";

const links = [
  { href: "/seguro-de-auto", label: "Seguro de Auto" },
  { href: "/seguro-de-moto", label: "Seguro de Moto" },
  { href: "/seguro-medico", label: "Seguro Medico" },
  { href: "/aseguradoras", label: "Aseguradoras" },
  { href: "/guias", label: "Guias" },
  { href: "/socios", label: "Para Aseguradoras" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Terminos" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 px-4 py-10">
      <nav className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-blue-600"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mt-6 text-center text-xs text-slate-400">
        Seguro no es una aseguradora ni un corredor de seguros. Te conectamos
        con aseguradoras y corredores habilitados en Paraguay.
      </p>
    </footer>
  );
}
